import { api } from '@/services/api';
import type { ScannerVerifyResponse, ScannerMarkAttendanceResponse } from '@/types/api';

export async function verifyQRToken(qrToken: string, eventId?: string): Promise<ScannerVerifyResponse> {
  const { data } = await api.post<ScannerVerifyResponse>('/api/scanner/verify', { qrToken, eventId });
  return data;
}

export async function markAttendance(
  registrationId: string,
): Promise<ScannerMarkAttendanceResponse> {
  const { data } = await api.post<ScannerMarkAttendanceResponse>('/api/scanner/mark-attendance', {
    registrationId,
  });
  return data;
}
