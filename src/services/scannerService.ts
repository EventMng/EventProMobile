import { api } from '@/services/api';
import type { ScannerVerifyResponse, ScannerMarkAttendanceResponse } from '@/types/api';

export async function verifyQRToken(qrToken: string): Promise<ScannerVerifyResponse> {
  const { data } = await api.post<ScannerVerifyResponse>('/api/scanner/verify', { qrToken });
  return data;
}

export async function markAttendance(
  registrationId: string,
  markedBy: string,
): Promise<ScannerMarkAttendanceResponse> {
  const { data } = await api.post<ScannerMarkAttendanceResponse>('/api/scanner/mark-attendance', {
    registrationId,
    markedBy,
  });
  return data;
}
