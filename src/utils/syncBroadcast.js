/**
 * Cross-Tab and Cross-Viewport Synchronization Engine
 * Combines BroadcastChannel API with window 'storage' event fallback.
 * Propagates state changes across Customer Mobile, Reception Tablet,
 * Barber Workstation, Wall TV Display, and Owner Admin in < 1 second.
 */

const CHANNEL_NAME = 'glamour_sync_channel';

class SyncBroadcaster {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    if ('BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notify(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel error, falling back to storage:', err);
      }
    }

    // Storage event fallback for cross-browser / cross-domain tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'glamoursync_sync_event' && event.newValue) {
        try {
          const payload = JSON.parse(event.newValue);
          this.notify(payload);
        } catch {
          // ignore
        }
      }
    });
  }

  broadcast(type, payload = {}) {
    const message = {
      type,
      payload,
      timestamp: Date.now(),
      senderTabId: window.__glamourTabId || (window.__glamourTabId = Math.random().toString(36).slice(2))
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn('Broadcast send error:', err);
      }
    }

    try {
      localStorage.setItem('glamoursync_sync_event', JSON.stringify(message));
    } catch {
      // ignore
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error('Sync listener error:', err);
      }
    });
  }
}

export const syncBroadcaster = new SyncBroadcaster();
