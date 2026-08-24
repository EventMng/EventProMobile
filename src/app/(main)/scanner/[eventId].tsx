import { api } from '@/services/api';
import { CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CameraOverlay } from '@/components/CameraOverlay';
import { ScannerFlashOverlay, FlashState } from '@/components/ScannerFlashOverlay';
import { useAttendanceSync } from '@/hooks/useAttendanceSync';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { verifyQRToken } from '@/services/scannerService';

export default function ScannerScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { isGranted, requestPermission } = useCameraPermission();
  const { sync } = useAttendanceSync();

  const [isScanningActive, setIsScanningActive] = useState(false);
  const [flashState, setFlashState] = useState<FlashState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const [scanResultData, setScanResultData] = useState<{
    fullName?: string;
    ticketType?: string;
    timeInfo?: string;
  }>({});

  const [eventData, setEventData] = useState<{
    name: string;
    location: string | null;
    totalRegistrations: number;
    checkedInCount: number;
  } | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (eventId) fetchEventInfo();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [eventId]);

  async function fetchEventInfo() {
    try {
      const res = await api.get('/api/events');
      const found = res.data?.find((e: any) => e.id === eventId);
      if (found) {
        setEventData({
          name: found.name,
          location: found.location,
          totalRegistrations: found.totalRegistrations,
          checkedInCount: found.checkedInCount,
        });
      }
    } catch (err) {
      console.error('Failed to load event tally:', err);
    }
  }

  function triggerFlashState(
    state: FlashState,
    data?: { fullName?: string; ticketType?: string; timeInfo?: string }
  ) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlashState(state);
    if (data) setScanResultData(data);

    if (state !== 'idle') {
      timerRef.current = setTimeout(() => {
        setFlashState('idle');
        setIsProcessing(false);
      }, 2500);
    } else {
      setIsProcessing(false);
    }
  }

  async function handleScan({ data }: { data: string }) {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const verified = await verifyQRToken(data, eventId);
      if (verified.attended) {
        triggerFlashState('duplicate', {
          fullName: verified.participant?.fullName || 'Guest',
          timeInfo: 'Already checked in',
        });
        return;
      }
      await sync(verified.registrationId);
      setEventData((prev) => prev ? { ...prev, checkedInCount: prev.checkedInCount + 1 } : null);
      triggerFlashState('success', {
        fullName: verified.participant?.fullName || 'Guest',
        ticketType: 'General Admission',
      });
    } catch (err: any) {
      triggerFlashState('error');
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
        {flashState === 'idle' && <CameraOverlay />}

        {/* Floating Close Button */}
        <TouchableOpacity
          style={styles.closeCameraBtn}
          onPress={() => {
            setFlashState('idle');
            setIsScanningActive(false);
          }}
        >
          <Text style={styles.closeCameraText}>✕ Close</Text>
        </TouchableOpacity>

        {/* QR Scanner 4 Result States Overlay */}
        <ScannerFlashOverlay
          state={flashState}
          participantName={scanResultData.fullName}
          ticketType={scanResultData.ticketType}
          timeInfo={scanResultData.timeInfo}
          eventName={eventData?.name}
          locationName={eventData?.location || 'Gate 1'}
          checkedInCount={eventData?.checkedInCount ?? 0}
          onPressToDismiss={() => triggerFlashState('idle')}
        />
      </View>
    );
  }

  const total = eventData?.totalRegistrations || 0;
  const checked = eventData?.checkedInCount || 0;
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
  const remaining = Math.max(0, total - checked);

  // Live Tally Screen with 4 State Preview Triggers
  return (
    <View style={styles.tallyContainer}>
      <Text style={styles.timeText}>{eventData?.name || 'Event Scanner'}</Text>

      {/* Live Badge */}
      <View style={styles.liveBadge}>
        <Text style={styles.liveBadgeText}>● Live · {eventData?.location || 'Gate 1'}</Text>
      </View>

      {/* Circular Gauge Tally Widget */}
      <View style={styles.gaugeOuter}>
        <View style={styles.gaugeInner}>
          <Text style={styles.tallyMainText}>{checked}</Text>
          <Text style={styles.tallySubText}>OF {total}</Text>
        </View>
      </View>

      {/* Percentage Check-in Info */}
      <Text style={styles.percentText}>{percent}% checked in</Text>
      <Text style={styles.remainingText}>{remaining} remaining</Text>

      {/* Main Action Button */}
      <TouchableOpacity
        style={styles.orangeButton}
        onPress={() => {
          if (!isGranted) {
            requestPermission();
          }
          setFlashState('idle');
          setIsScanningActive(true);
        }}
      >
        <Text style={styles.orangeButtonText}>Resume scanning</Text>
      </TouchableOpacity>

      {/* Design Spec State Preview Selector */}
      <View style={styles.previewSection}>
        <Text style={styles.previewSectionTitle}>TEST 4 SCANNER STATES:</Text>
        <View style={styles.previewBtnRow}>
          <TouchableOpacity
            style={[styles.previewBtn, { backgroundColor: '#111827' }]}
            onPress={() => {
              if (!isGranted) requestPermission();
              setFlashState('idle');
              setIsScanningActive(true);
            }}
          >
            <Text style={styles.previewBtnText}>Idle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, { backgroundColor: '#F96C15' }]}
            onPress={() => {
              setFlashState('idle');
              setIsScanningActive(true);
              triggerFlashState('success', { fullName: 'Nadeesha Perera', ticketType: 'General Admission' });
            }}
          >
            <Text style={styles.previewBtnText}>Success</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, { backgroundColor: '#D92D2D' }]}
            onPress={() => {
              setFlashState('idle');
              setIsScanningActive(true);
              triggerFlashState('error');
            }}
          >
            <Text style={styles.previewBtnText}>Error</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, { backgroundColor: '#B4890F' }]}
            onPress={() => {
              setFlashState('idle');
              setIsScanningActive(true);
              triggerFlashState('duplicate', { fullName: 'Kasun Fernando', timeInfo: '9:14 AM at Gate 1' });
            }}
          >
            <Text style={styles.previewBtnText}>Duplicate</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    zIndex: 60,
  },
  closeCameraText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  previewSection: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  previewSectionTitle: {
    fontSize: 11,
    fontFamily: 'Urbanist_700Bold',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  previewBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
  },
});
