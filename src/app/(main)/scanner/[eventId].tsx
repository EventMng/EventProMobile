import { CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CameraOverlay } from '@/components/CameraOverlay';
import { ParticipantSheet } from '@/components/ParticipantSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { useAttendanceSync } from '@/hooks/useAttendanceSync';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { verifyQRToken } from '@/services/scannerService';
import type { ScannerVerifyResponse } from '@/types/api';

type Status = 'idle' | 'success' | 'error' | 'already-marked';

export default function ScannerScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { isGranted, requestPermission } = useCameraPermission();
  const { sync } = useAttendanceSync();

  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ScannerVerifyResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleScan({ data }: { data: string }) {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const verified = await verifyQRToken(data);
      if (verified.attended) {
        setStatus('already-marked');
        setResult(verified);
        return;
      }
      await sync(verified.registrationId, eventId);
      setStatus('success');
      setResult(verified);
    } catch {
      setStatus('error');
      setResult(null);
    } finally {
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
        setIsProcessing(false);
      }, 2000);
    }
  }

  if (!isGranted) {
    requestPermission();
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={isProcessing ? undefined : handleScan}
      />
      <CameraOverlay />
      <View style={styles.statusRow}>
        <StatusBadge status={status} />
      </View>
      {result && <ParticipantSheet result={result} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  statusRow: { position: 'absolute', top: 60, left: 0, right: 0 },
});
