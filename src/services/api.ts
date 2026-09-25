import { create } from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getToken, clearToken } from '@/services/authStorage';
import { router } from 'expo-router';

const getDefaultBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // Current active computer Wi-Fi IP
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://10.200.119.91:3000';
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = getDefaultBaseUrl();

export const api = create({ baseURL: API_BASE_URL, timeout: 10000 });

api.interceptors.request.use(async (config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`);
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // TEMPORARY: login isn't wired to a real backend yet (see authStorage's
  // 'demo-token'), so the backend can't identify this caller as a Frontman
  // from the bearer token alone. x-dev-role only has any effect when the
  // backend's DEV_BYPASS_AUTH dev flag is on; remove once real mobile login
  // issues a verifiable JWT.
  config.headers['x-dev-role'] = 'FRONTMAN';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await clearToken();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);
