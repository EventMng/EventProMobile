import { CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CameraOverlay } from '@/components/CameraOverlay';
import { ParticipantSheet } from '@/components/ParticipantSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { useAttendanceSync } from '@/hooks/useAttendanceSync';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { verifyQRToken } from '@/services/scannerService';
import type { ScannerVerifyResponse } from '@/types/api';

type Status = 'idle' | 'success' | 'error' | 'already-marked';

const MOCK_PARTICIPANT: ScannerVerifyResponse = {
  registrationId: 'reg_1234567890abc',
  participant: {
    id: 'part_1',
    fullName: 'Kasun Fernando',
    email: 'kasun.fernando@example.com',
  },
  event: {
    id: 'evt_1',
    name: 'Tech Summit 2026',
  },
  attended: false,
};

export default function ScannerScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { isGranted, requestPermission } = useCameraPermission();
  const { sync } = useAttendanceSync();

  const [isScanningActive, setIsScanningActive] = useState(false);
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

  // Active Camera Scanner View
  if (isScanningActive && isGranted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={isProcessing ? undefined : handleScan}
        />
        <CameraOverlay />
        <View style={styles.statusRow}>
          <StatusBadge status={status} />
        </View>

        <TouchableOpacity
          style={styles.closeCameraBtn}
          onPress={() => setIsScanningActive(false)}
        >
          <Text style={styles.closeCameraText}>Close Camera</Text>
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

  // Live Tally Screen (Design Spec Match)
  return (
    <View style={styles.tallyContainer}>
      <Text style={styles.timeText}>9:41</Text>

      {/* Live Badge */}
      <View style={styles.liveBadge}>
        <Text style={styles.liveBadgeText}>● Live · Gate 2</Text>
      </View>

      {/* Circular Gauge Tally Widget */}
      <View style={styles.gaugeOuter}>
        <View style={styles.gaugeInner}>
          <Text style={styles.tallyMainText}>1,034</Text>
          <Text style={styles.tallySubText}>OF 1,520</Text>
        </View>
      </View>

      {/* Percentage Check-in Info */}
      <Text style={styles.percentText}>68% checked in</Text>
      <Text style={styles.remainingText}>486 remaining</Text>

      {/* Orange Action Button */}
      <TouchableOpacity
        style={styles.orangeButton}
        onPress={() => {
          if (!isGranted) {
            requestPermission();
          }
          setIsScanningActive(true);
        }}
      >
        <Text style={styles.orangeButtonText}>Resume scanning</Text>
      </TouchableOpacity>

      {/* Instant Test Scan Button */}
      <TouchableOpacity
        style={styles.testScanBtn}
        onPress={() => setResult(MOCK_PARTICIPANT)}
      >
        <Text style={styles.testScanBtnText}>⚡ Test Scan Ticket Card UI</Text>
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

const styles = StyleSheet.create({
  tallyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 44,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  liveBadge: {
    backgroundColor: '#FFEDD5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 36,
  },
  liveBadgeText: {
    color: '#EA580C',
    fontSize: 13,
    fontWeight: '700',
  },
  gaugeOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 16,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  gaugeInner: {
    alignItems: 'center',
  },
  tallyMainText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
  },
  tallySubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  remainingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 36,
  },
  orangeButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  orangeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  testScanBtn: {
    paddingVertical: 10,
  },
  testScanBtnText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusRow: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeCameraBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 20,
  },
  closeCameraText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
