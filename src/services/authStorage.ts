import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'eventpro_jwt';
const USER_KEY = 'eventpro_user';

function getWebStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return (globalThis as any).localStorage as Storage;
  }
  return null;
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    const storage = getWebStorage();
    return storage ? storage.getItem(TOKEN_KEY) : null;
  }
}

export async function setToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    const storage = getWebStorage();
    if (storage) {
      storage.setItem(TOKEN_KEY, token);
    }
  }
}

export async function setUser(user: any): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    const storage = getWebStorage();
    if (storage) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
}

export async function getUser(): Promise<any | null> {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    const storage = getWebStorage();
    if (storage) {
      const raw = storage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    const storage = getWebStorage();
    if (storage) {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(USER_KEY);
    }
  }
}
