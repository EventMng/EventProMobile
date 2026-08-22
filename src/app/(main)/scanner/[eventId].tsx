import { CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { CameraOverlay } from '@/components/CameraOverlay';
import { ParticipantSheet } from '@/components/ParticipantSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { useAttendanceSync } from '@/hooks/useAttendanceSync';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { verifyQRToken } from '@/services/scannerService';
import type { ScannerVerifyResponse } from '@/types/api';

type Status = 'idle' | 'success' | 'error' | 'already-marked';

// Mock sample data for instant UI preview
const MOCK_PARTICIPANT: ScannerVerifyResponse = {
  registrationId: 'reg_1234567890abc',
  participant: {
    id: 'part_1',
    fullName: 'Kasun Fernando',
    email: 'kasun.fernando@example.com',
  },
  event: {
    id: 'evt_1',
    name: 'EventPro Tech Summit 2026',
  },
  attended: false,
};

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
      await sync(verified.registrationId, eventId || 'default-event');
      setStatus('success');
      setResult(verified);
    } catch {
      setStatus('error');
      setResult(null);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  }

  // Camera Permission Required View
  if (!isGranted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>
          EventPro Scanner requires camera access to scan attendee QR tickets.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>

        {/* Instant Preview Button */}
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => setResult(MOCK_PARTICIPANT)}
        >
          <Text style={styles.previewButtonText}>Preview Ticket UI Card</Text>
        </TouchableOpacity>

        {result && (
          <ParticipantSheet
            result={result}
            onConfirmCheckIn={() => {
              setResult({ ...result, attended: true });
              setTimeout(() => setResult(null), 1500);
            }}
            onDismiss={() => setResult(null)}
          />
        )}
      </View>
    );
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

      {/* Dev Mode UI Preview Button */}
      {!result && (
        <TouchableOpacity
          style={styles.devPreviewBtn}
          onPress={() => setResult(MOCK_PARTICIPANT)}
        >
          <Text style={styles.devPreviewText}>Test Ticket Card UI</Text>
        </TouchableOpacity>
      )}

      {result && (
        <ParticipantSheet
          result={result}
          onConfirmCheckIn={() => {
            setResult({ ...result, attended: true });
            setTimeout(() => setResult(null), 1500);
          }}
          onDismiss={() => setResult(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#032042' },
  statusRow: { position: 'absolute', top: 60, left: 0, right: 0, zIndex: 10 },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#032042',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSub: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#184F95',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  previewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 14,
  },
  devPreviewBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(24, 79, 149, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  devPreviewText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
