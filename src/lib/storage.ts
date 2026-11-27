import { Item, Claim, AppNotification, User } from './types';
import { INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_NOTIFICATIONS, PRESET_USERS } from './mockData';

const STORAGE_KEYS = {
  ITEMS: 'unitrace_items_v2',
  CLAIMS: 'unitrace_claims_v2',
  NOTIFICATIONS: 'unitrace_notifications_v2',
  CURRENT_USER: 'unitrace_user_v2',
};

// Safe access for SSR / Server Components
const isClient = typeof window !== 'undefined';

export function getStoredItems(): Item[] {
  if (!isClient) return INITIAL_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read items from localStorage:', e);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: Item[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to localStorage:', e);
  }
}

export function getStoredClaims(): Claim[] {
  if (!isClient) return INITIAL_CLAIMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read claims from localStorage:', e);
    return INITIAL_CLAIMS;
  }
}

export function saveStoredClaims(claims: Claim[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error('Failed to save claims to localStorage:', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  if (!isClient) return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read notifications from localStorage:', e);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications to localStorage:', e);
  }
}

export function getStoredUser(): User {
  if (!isClient) return PRESET_USERS[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(PRESET_USERS[0]));
      return PRESET_USERS[0];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read user from localStorage:', e);
    return PRESET_USERS[0];
  }
}

export function saveStoredUser(user: User): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to localStorage:', e);
  }
}

export function resetDemoDatabase(): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
  localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(PRESET_USERS[0]));
}
