// Service Worker Management for Solo Hunter App

interface NotificationOptions {
  title: string;
  body: string;
  delay?: number;
  tag?: string;
  icon?: string;
  badge?: string;
  vibrate?: number[];
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface ServiceWorkerMessage {
  type: string;
  data?: any;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = 'serviceWorker' in navigator;
  
  async init(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Service Worker not supported');
      return false;
    }

    // Enable service worker for deployed app
    const isDeployed = location.protocol === 'https:' || location.hostname.includes('replit.app');
    
    if (!isDeployed) {
      console.log('Service Worker requires HTTPS deployment - enabling in production');
      return false;
    }
    
    console.log('Deployed environment detected - enabling Service Worker');
    
    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('Service Worker registered:', this.registration);
      
      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              this.notifyUpdate();
            }
          });
        }
      });
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));
      
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  
  private handleMessage(event: MessageEvent) {
    const { type, data } = event.data as ServiceWorkerMessage;
    
    switch (type) {
      case 'UPDATE_AVAILABLE':
        this.notifyUpdate();
        break;
      case 'CACHE_UPDATED':
        console.log('Cache updated with new content');
        break;
      default:
        console.log('Unknown message from service worker:', type);
    }
  }
  
  private notifyUpdate() {
    // Show update notification to user
    if (confirm('New version available! Reload to update?')) {
      this.updateServiceWorker();
    }
  }
  
  async updateServiceWorker() {
    if (!this.registration) return;
    
    const waitingWorker = this.registration.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', () => {
        if (waitingWorker.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }
  
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }
    
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }
  
  async showNotification(options: NotificationOptions): Promise<boolean> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return false;
    }
    
    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return false;
    }
    
    try {
      const notificationOptions: NotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options
      };
      
      if (options.delay && options.delay > 0) {
        // Schedule notification
        this.scheduleNotification(options);
      } else {
        // Show immediately
        await this.registration.showNotification(options.title, notificationOptions);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }
  
  private scheduleNotification(options: NotificationOptions) {
    if (!this.registration) return;
    
    // Send message to service worker to schedule notification
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        notification: options
      });
    });
  }
  
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return null;
    }
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    
    try {
      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.warn('Push messaging not supported');
        return null;
      }
      
      // Check if service worker is active
      if (!this.registration.active) {
        console.warn('Service worker not active yet');
        return null;
      }
      
      // For basic notifications, we don't need VAPID keys
      // Using simple push subscription
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true
      });
      
      console.log('Push subscription:', subscription);
      
      // Send subscription to your server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Push notification registration failed:', error);
      return null;
    }
  }
  
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }
  
  async enableBackgroundSync(): Promise<boolean> {
    if (!this.registration) return false;
    
    // Wait for service worker to be active
    await navigator.serviceWorker.ready;
    
    try {
      // Check if background sync is supported
      if (!('sync' in this.registration)) {
        console.warn('Background sync not supported');
        return false;
      }
      
      // Check if service worker is active
      if (!this.registration.active) {
        console.warn('Service worker not active yet');
        return false;
      }
      
      // Register for background sync
      await this.registration.sync.register('background-sync');
      console.log('Background sync registered');
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }
  
  async cacheUrls(urls: string[]): Promise<void> {
    if (!this.registration) return;
    
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'CACHE_URLS',
        urls
      });
    });
  }
  
  isOnline(): boolean {
    return navigator.onLine;
  }
  
  onOnlineStatusChange(callback: (online: boolean) => void) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
  
  async getVersion(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.registration) {
        resolve('unknown');
        return;
      }
      
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.version || 'unknown');
      };
      
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
      });
    });
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Hunter-specific notification helpers
export const HunterNotifications = {
  questReminder: (questTitle: string) => 
    serviceWorkerManager.showNotification({
      title: 'Quest Reminder 🎯',
      body: `Don't forget about: ${questTitle}`,
      tag: 'quest-reminder',
      actions: [
        { action: 'view', title: 'View Quest' },
        { action: 'complete', title: 'Mark Complete' }
      ]
    }),
  
  dailyMotivation: () =>
    serviceWorkerManager.showNotification({
      title: 'Rise and Hunt! 🌅',
      body: 'A new day of challenges awaits. Check your quests and level up!',
      tag: 'daily-motivation'
    }),
  
  streakAlert: (streakCount: number) =>
    serviceWorkerManager.showNotification({
      title: `${streakCount} Day Streak! 🔥`,
      body: 'Keep the momentum going, Hunter!',
      tag: 'streak-alert'
    }),
  
  levelUp: (newLevel: number) =>
    serviceWorkerManager.showNotification({
      title: 'Level Up! ⚡',
      body: `Congratulations! You've reached Level ${newLevel}!`,
      tag: 'level-up',
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300]
    })
};

export default serviceWorkerManager;