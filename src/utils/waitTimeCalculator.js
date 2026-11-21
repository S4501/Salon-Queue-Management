/**
 * Dynamic Wait Time Calculator with Event-Driven Floor Simulation
 *
 * Implements a realistic floor scheduler:
 * - Active barbers who are not on break have a timeline ("chairFreeAt" in minutes from now).
 * - If barber is BUSY: chairFreeAt = remaining service time R_b.
 * - If barber is AVAILABLE: chairFreeAt = 0.
 *
 * Then, for each waiting customer in sequential FIFO order:
 * - If customer requested specific barber X:
 *   waitMinutes = chairFreeAt[X]
 *   chairFreeAt[X] += customer.totalDuration
 * - If customer requested ANY barber:
 *   find active chair with min(chairFreeAt)
 *   waitMinutes = min(chairFreeAt)
 *   chairFreeAt[minBarber] += customer.totalDuration
 *
 * Zero-Barber Fallback Guard:
 * When all barbers are ON_BREAK, waitMinutes = 0, isPaused = true.
 */

// Helper to compute remaining service minutes for a barber currently serving
function getBarberRemainingMinutes(barber, queue) {
  if (barber.status !== 'BUSY' || !barber.currentServiceToken) {
    return 0;
  }
  const currentToken = queue.find(t => t.id === barber.currentServiceToken && t.status === 'IN_SERVICE');
  if (!currentToken) return 0;

  const totalDur = currentToken.totalDuration || 30;
  const startTime = barber.serviceStartedAt || currentToken.serviceStartedAt || Date.now();
  const elapsedMinutes = Math.floor((Date.now() - startTime) / (60 * 1000));
  return Math.max(0, totalDur - elapsedMinutes);
}

/**
 * Simulates floor schedule for all waiting tokens in FIFO order.
 * Returns a Map of tokenId -> waitMinutes.
 */
export function simulateQueueSchedule({ queue = [], barbers = [] }) {
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  if (activeBarbers.length === 0) {
    return { isPaused: true, schedule: new Map() };
  }

  // Initialize each chair's availability offset (in minutes from now)
  const chairFreeAt = {};
  activeBarbers.forEach(b => {
    chairFreeAt[b.id] = getBarberRemainingMinutes(b, queue);
  });

  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  const schedule = new Map();

  for (const token of waitingTokens) {
    const pref = token.preferredBarberId || 'ANY';
    const duration = token.totalDuration || 30;

    if (pref !== 'ANY' && chairFreeAt[pref] !== undefined) {
      // Customer explicitly requested specific barber
      const wait = chairFreeAt[pref];
      schedule.set(token.id, wait);
      chairFreeAt[pref] += duration;
    } else {
      // Customer requested "ANY" - assign to earliest available active chair
      let earliestBarberId = activeBarbers[0].id;
      let minWait = chairFreeAt[earliestBarberId];

      for (const b of activeBarbers) {
        if (chairFreeAt[b.id] < minWait) {
          minWait = chairFreeAt[b.id];
          earliestBarberId = b.id;
        }
      }

      schedule.set(token.id, minWait);
      chairFreeAt[earliestBarberId] += duration;
    }
  }

  return { isPaused: false, schedule };
}

/**
 * Calculates wait time for a specific token or general first waiting token.
 */
export function calculateWaitTime({
  token,
  queue = [],
  barbers = [],
  servicesMap = {}
}) {
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  if (activeBarbers.length === 0) {
    return {
      waitMinutes: 0,
      isPaused: true,
      textKey: 'allStylistsBreak'
    };
  }

  const { isPaused, schedule } = simulateQueueSchedule({ queue, barbers });
  if (isPaused) {
    return {
      waitMinutes: 0,
      isPaused: true,
      textKey: 'allStylistsBreak'
    };
  }

  // 1. If token is already in queue
  if (token && schedule.has(token.id)) {
    return {
      waitMinutes: schedule.get(token.id),
      isPaused: false
    };
  }

  // 2. If token is a hypothetical/preview token not yet appended to queue
  if (token) {
    const simulatedQueue = [...queue, token];
    const sim = simulateQueueSchedule({ queue: simulatedQueue, barbers });
    const wait = sim.schedule.get(token.id) ?? 0;
    return {
      waitMinutes: wait,
      isPaused: false
    };
  }

  // 3. Fallback: First waiting token in line
  const firstWaiting = queue.find(t => t.status === 'WAITING');
  if (firstWaiting && schedule.has(firstWaiting.id)) {
    return {
      waitMinutes: schedule.get(firstWaiting.id),
      isPaused: false
    };
  }

  return {
    waitMinutes: 0,
    isPaused: false
  };
}

/**
 * Quick wait estimate for customer before joining (based on selected services & barber)
 */
export function estimateNewWaitTime({
  serviceDuration,
  preferredBarberId,
  queue = [],
  barbers = []
}) {
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  if (activeBarbers.length === 0) {
    return { waitMinutes: 0, isPaused: true };
  }

  const dummyToken = {
    id: 'T-TEMP-ESTIMATE',
    preferredBarberId: preferredBarberId || 'ANY',
    totalDuration: serviceDuration || 30,
    status: 'WAITING'
  };

  return calculateWaitTime({
    token: dummyToken,
    queue,
    barbers
  });
}
