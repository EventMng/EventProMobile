import { create } from 'axios';

import { getToken } from '@/services/authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const api = create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
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
