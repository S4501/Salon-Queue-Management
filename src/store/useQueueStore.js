import { create } from 'zustand';
import { initialBarbers, initialServices, initialTokens } from '../data/seedData';
import { syncBroadcaster } from '../utils/syncBroadcast';
import { playChime } from '../utils/audioChime';

const STORAGE_KEY = 'glamoursync_app_state_v1';

// Load stored state or use initial seed data
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.queue && parsed.barbers && parsed.services) {
        // Automatically sync fresh stylist avatars if seed data updated
        const updatedBarbers = parsed.barbers.map(b => {
          const fresh = initialBarbers.find(ib => ib.id === b.id);
          return fresh ? { ...b, avatar: fresh.avatar } : b;
        });
        return {
          ...parsed,
          barbers: updatedBarbers
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load persisted state:', err);
  }

  return {
    barbers: initialBarbers,
    services: initialServices,
    queue: initialTokens,
    isMasterQueueOpen: true,
    isAutoCutoffEnabled: true,
    lastCalledToken: null,
    lastCalledTimestamp: null
  };
}

function persistState(state) {
  try {
    const toSave = {
      barbers: state.barbers,
      services: state.services,
      queue: state.queue,
      isMasterQueueOpen: state.isMasterQueueOpen,
      isAutoCutoffEnabled: state.isAutoCutoffEnabled,
      lastCalledToken: state.lastCalledToken,
      lastCalledTimestamp: state.lastCalledTimestamp
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('Failed to persist state:', err);
  }
}

export const useQueueStore = create((set, get) => {
  const loaded = loadPersistedState();

  // Listen for cross-tab broadcasts
  syncBroadcaster.subscribe((msg) => {
    if (msg.type === 'QUEUE_MUTATED') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const fresh = JSON.parse(raw);
          set({
            barbers: fresh.barbers,
            services: fresh.services,
            queue: fresh.queue,
            isMasterQueueOpen: fresh.isMasterQueueOpen,
            isAutoCutoffEnabled: fresh.isAutoCutoffEnabled,
            lastCalledToken: fresh.lastCalledToken,
            lastCalledTimestamp: fresh.lastCalledTimestamp
          });
          if (msg.payload?.action === 'CALLED') {
            playChime();
          }
        }
      } catch (e) {
        console.error('Failed to sync incoming broadcast:', e);
      }
    }
  });

  return {
    ...loaded,

    // Helper to commit state changes, persist, and broadcast
    _commit: (newPartial, actionType = 'GENERAL') => {
      set((state) => {
        const next = { ...state, ...newPartial };
        persistState(next);
        syncBroadcaster.broadcast('QUEUE_MUTATED', { action: actionType });
        return next;
      });
    },

    // 1. Join Queue (Customer or Reception)
    joinQueue: ({ customerName, phone, serviceIds, preferredBarberId = 'ANY', source = 'REMOTE' }) => {
      const state = get();

      // Check Master Queue Open
      if (!state.isMasterQueueOpen) {
        throw new Error('QUEUE_PAUSED');
      }

      // Clean phone number (last 10 digits)
      const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

      // Check if preferred barber is on break
      if (preferredBarberId !== 'ANY') {
        const prefBarber = state.barbers.find(b => b.id === preferredBarberId);
        if (prefBarber && prefBarber.status === 'ON_BREAK') {
          const err = new Error('BARBER_ON_BREAK');
          err.barberName = prefBarber.name;
          throw err;
        }
      }

      // Duplicate phone check for active tokens
      if (cleanPhone.length === 10) {
        const existing = state.queue.find(t => {
          const tPhone = (t.phone || '').replace(/\D/g, '').slice(-10);
          return tPhone === cleanPhone && ['WAITING', 'CALLED', 'IN_SERVICE'].includes(t.status);
        });

        if (existing) {
          const err = new Error('DUPLICATE_PHONE');
          err.existingTokenId = existing.id;
          throw err;
        }
      }

      // Calculate service duration and cost
      const selectedServices = state.services.filter(s => serviceIds.includes(s.id));
      const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0) || 30;
      const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0) || 250;

      // Generate sequential token ID (e.g. T-109)
      const tokenNumbers = state.queue.map(t => {
        const match = t.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
      const nextNum = (Math.max(100, ...tokenNumbers) + 1);
      const tokenId = `T-${nextNum}`;

      const newToken = {
        id: tokenId,
        customerName: customerName.trim() || 'Walk-in Guest',
        phone: cleanPhone || '9825000000',
        services: serviceIds,
        totalDuration,
        totalPrice,
        preferredBarberId,
        assignedBarberId: null,
        status: 'WAITING',
        joinedAt: Date.now(),
        calledAt: null,
        serviceStartedAt: null,
        completedAt: null,
        source
      };

      const updatedQueue = [...state.queue, newToken];
      state._commit({ queue: updatedQueue }, 'JOINED');

      return newToken;
    },

    // 2. Call Next Customer (Barber or Reception)
    callNextCustomer: (barberId, specificTokenId = null) => {
      const state = get();

      // Dynamic Auto-Resolution: If barberId is 'ANY' or omitted, find the first available active chair
      let targetBarberId = barberId;
      if (!targetBarberId || targetBarberId === 'ANY') {
        const availableBarber = state.barbers.find(b => b.status === 'AVAILABLE' && !b.currentServiceToken);
        if (!availableBarber) {
          throw new Error('CHAIR_ALREADY_BUSY');
        }
        targetBarberId = availableBarber.id;
      }

      const barber = state.barbers.find(b => b.id === targetBarberId);
      if (!barber) return null;

      // Chair Concurrency Guard: Cannot call if chair already has active customer in IN_SERVICE
      if (barber.status === 'BUSY' && barber.currentServiceToken) {
        const active = state.queue.find(t => t.id === barber.currentServiceToken && t.status === 'IN_SERVICE');
        if (active) {
          throw new Error('CHAIR_ALREADY_BUSY');
        }
      }

      // Smart FIFO Matching Algorithm or Specific Token Dispatch
      const waitingTokens = state.queue.filter(t => t.status === 'WAITING');
      let targetToken = null;

      // If reception explicitly targeted a specific waiting token
      if (specificTokenId) {
        targetToken = waitingTokens.find(t => t.id === specificTokenId) || null;
      }

      // If no specific token targeted or token not found, find next eligible via FIFO
      if (!targetToken) {
        for (const token of waitingTokens) {
          // Preferred exact barber
          if (token.preferredBarberId === targetBarberId) {
            targetToken = token;
            break;
          }
          // "Any Barber" matches
          if (token.preferredBarberId === 'ANY') {
            targetToken = token;
            break;
          }
        }
      }

      if (!targetToken) {
        return null; // No eligible customers
      }

      const now = Date.now();

      const updatedQueue = state.queue.map(t => {
        if (t.id === targetToken.id) {
          return {
            ...t,
            status: 'CALLED',
            assignedBarberId: targetBarberId,
            calledAt: now
          };
        }
        return t;
      });

      const updatedBarbers = state.barbers.map(b => {
        if (b.id === targetBarberId) {
          return {
            ...b,
            status: 'BUSY',
            currentServiceToken: targetToken.id,
            serviceStartedAt: null
          };
        }
        return b;
      });

      const calledToken = {
        ...targetToken,
        status: 'CALLED',
        assignedBarberId: targetBarberId,
        calledAt: now
      };

      state._commit({
        queue: updatedQueue,
        barbers: updatedBarbers,
        lastCalledToken: calledToken,
        lastCalledTimestamp: now
      }, 'CALLED');

      playChime();

      return calledToken;
    },

    // 3. Start Service (Customer arrives at chair)
    startService: (tokenId, barberId) => {
      const state = get();
      const now = Date.now();

      const updatedQueue = state.queue.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: 'IN_SERVICE',
            assignedBarberId: barberId,
            serviceStartedAt: now
          };
        }
        return t;
      });

      const updatedBarbers = state.barbers.map(b => {
        if (b.id === barberId) {
          return {
            ...b,
            status: 'BUSY',
            currentServiceToken: tokenId,
            serviceStartedAt: now
          };
        }
        return b;
      });

      state._commit({
        queue: updatedQueue,
        barbers: updatedBarbers
      }, 'SERVICE_STARTED');
    },

    // 4. Complete Service (Service finished)
    completeService: (tokenId) => {
      const state = get();
      const token = state.queue.find(t => t.id === tokenId);
      if (!token) return;

      const barberId = token.assignedBarberId;
      const now = Date.now();

      const updatedQueue = state.queue.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: 'COMPLETED',
            completedAt: now
          };
        }
        return t;
      });

      const updatedBarbers = state.barbers.map(b => {
        if (b.id === barberId || b.currentServiceToken === tokenId) {
          return {
            ...b,
            status: b.status === 'ON_BREAK' ? 'ON_BREAK' : 'AVAILABLE',
            currentServiceToken: null,
            serviceStartedAt: null
          };
        }
        return b;
      });

      state._commit({
        queue: updatedQueue,
        barbers: updatedBarbers
      }, 'SERVICE_COMPLETED');
    },

    // 4b. Finish Early and Immediately Call Next Customer
    finishEarlyAndCallNext: (tokenId, barberId) => {
      const state = get();
      state.completeService(tokenId);
      return get().callNextCustomer(barberId);
    },

    // 5. Mark No-Show (10-min grace expired)
    markNoShow: (tokenId) => {
      const state = get();
      const token = state.queue.find(t => t.id === tokenId);
      if (!token) return;

      const barberId = token.assignedBarberId;
      const now = Date.now();

      const updatedQueue = state.queue.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: 'NO_SHOW',
            noShowAt: now
          };
        }
        return t;
      });

      const updatedBarbers = state.barbers.map(b => {
        if (b.id === barberId || b.currentServiceToken === tokenId) {
          return {
            ...b,
            status: b.status === 'ON_BREAK' ? 'ON_BREAK' : 'AVAILABLE',
            currentServiceToken: null,
            serviceStartedAt: null
          };
        }
        return b;
      });

      state._commit({
        queue: updatedQueue,
        barbers: updatedBarbers
      }, 'NO_SHOW');
    },

    // 6. Re-Add Customer from No-Show (Strictly at tail end of queue)
    reAddNoShow: (tokenId) => {
      const state = get();
      // Only allow re-adding if token exists and is currently in NO_SHOW status
      const oldToken = state.queue.find(t => t.id === tokenId && t.status === 'NO_SHOW');
      if (!oldToken) return null;

      // Duplicate prevention: check if customer phone is already active in queue
      const cleanPhone = (oldToken.phone || '').replace(/\D/g, '');
      if (cleanPhone) {
        const alreadyActive = state.queue.find(t => {
          const tPhone = (t.phone || '').replace(/\D/g, '');
          return tPhone === cleanPhone && ['WAITING', 'CALLED', 'IN_SERVICE'].includes(t.status);
        });
        if (alreadyActive) {
          console.warn(`Customer with phone ${cleanPhone} is already active in queue with token ${alreadyActive.id}`);
          return null;
        }
      }

      const tokenNumbers = state.queue.map(t => {
        const match = t.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
      const nextNum = Math.max(100, ...tokenNumbers) + 1;
      const newId = `T-${nextNum}`;

      const newToken = {
        ...oldToken,
        id: newId,
        status: 'WAITING',
        joinedAt: Date.now(),
        calledAt: null,
        serviceStartedAt: null,
        completedAt: null,
        noShowAt: null,
        assignedBarberId: null
      };

      // Mark the old token as RE_ADDED so it immediately disappears from the NO_SHOW tab
      const updatedQueue = state.queue.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: 'RE_ADDED',
            reAddedAt: Date.now(),
            reAddedTokenId: newId
          };
        }
        return t;
      });

      // Insert new token strictly at the tail of the waiting line
      updatedQueue.push(newToken);

      // Update cached customer token in localStorage if it belonged to this client
      try {
        const storedToken = localStorage.getItem('glamoursync_last_token');
        if (storedToken === tokenId) {
          localStorage.setItem('glamoursync_last_token', newId);
        }
      } catch (err) {
        // ignore
      }

      state._commit({ queue: updatedQueue }, 'RE_ADDED');
      return newToken;
    },

    // 7. Cancel Spot (Customer or Receptionist)
    cancelToken: (tokenId) => {
      const state = get();
      const token = state.queue.find(t => t.id === tokenId);
      if (!token) return;

      const barberId = token.assignedBarberId;
      const now = Date.now();

      const updatedQueue = state.queue.map(t => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: 'CANCELLED',
            cancelledAt: now
          };
        }
        return t;
      });

      const updatedBarbers = state.barbers.map(b => {
        if (b.id === barberId && b.currentServiceToken === tokenId) {
          return {
            ...b,
            status: b.status === 'ON_BREAK' ? 'ON_BREAK' : 'AVAILABLE',
            currentServiceToken: null,
            serviceStartedAt: null
          };
        }
        return b;
      });

      state._commit({
        queue: updatedQueue,
        barbers: updatedBarbers
      }, 'CANCELLED');
    },

    // 8. Barber Break Toggle
    toggleBarberBreak: (barberId) => {
      const state = get();
      const updatedBarbers = state.barbers.map(b => {
        if (b.id === barberId) {
          const nextStatus = b.status === 'ON_BREAK' ? 'AVAILABLE' : 'ON_BREAK';
          return {
            ...b,
            status: nextStatus
          };
        }
        return b;
      });

      state._commit({ barbers: updatedBarbers }, 'BARBER_BREAK_TOGGLED');
    },

    // 9. Admin Controls: Master Queue Switch
    setMasterQueue: (isOpen) => {
      const state = get();
      state._commit({ isMasterQueueOpen: isOpen }, 'MASTER_QUEUE_TOGGLED');
    },

    // 10. Admin Controls: Auto-cutoff toggle
    setAutoCutoff: (isEnabled) => {
      const state = get();
      state._commit({ isAutoCutoffEnabled: isEnabled }, 'AUTO_CUTOFF_TOGGLED');
    },

    // 11. Service Catalog CRUD
    addService: (newService) => {
      const state = get();
      const service = {
        ...newService,
        id: `srv-${Date.now()}`
      };
      state._commit({ services: [...state.services, service] }, 'SERVICE_ADDED');
    },

    updateService: (serviceId, updates) => {
      const state = get();
      const updated = state.services.map(s => s.id === serviceId ? { ...s, ...updates } : s);
      state._commit({ services: updated }, 'SERVICE_UPDATED');
    },

    deleteService: (serviceId) => {
      const state = get();
      const updated = state.services.filter(s => s.id !== serviceId);
      state._commit({ services: updated }, 'SERVICE_DELETED');
    },

    // 12. Barber Roster CRUD
    addBarber: (newBarber) => {
      const state = get();
      const barber = {
        ...newBarber,
        id: `barber-${Date.now()}`,
        status: 'AVAILABLE',
        currentServiceToken: null,
        serviceStartedAt: null
      };
      state._commit({ barbers: [...state.barbers, barber] }, 'BARBER_ADDED');
    },

    updateBarber: (barberId, updates) => {
      const state = get();
      const updated = state.barbers.map(b => b.id === barberId ? { ...b, ...updates } : b);
      state._commit({ barbers: updated }, 'BARBER_UPDATED');
    },

    deleteBarber: (barberId) => {
      const state = get();
      const updated = state.barbers.filter(b => b.id !== barberId);
      state._commit({ barbers: updated }, 'BARBER_DELETED');
    },

    // 13. Reorder Queue (Reception drag or manual move)
    reorderQueue: (sourceIndex, destinationIndex) => {
      const state = get();
      const waiting = state.queue.filter(t => t.status === 'WAITING');
      const nonWaiting = state.queue.filter(t => t.status !== 'WAITING');

      const reorderedWaiting = Array.from(waiting);
      const [moved] = reorderedWaiting.splice(sourceIndex, 1);
      reorderedWaiting.splice(destinationIndex, 0, moved);

      state._commit({ queue: [...nonWaiting, ...reorderedWaiting] }, 'QUEUE_REORDERED');
    },

    // Reset database to seed defaults
    resetToDefaults: () => {
      const state = get();
      state._commit({
        barbers: initialBarbers,
        services: initialServices,
        queue: initialTokens,
        isMasterQueueOpen: true,
        isAutoCutoffEnabled: true,
        lastCalledToken: null,
        lastCalledTimestamp: null
      }, 'RESET_DEFAULTS');
    }
  };
});
