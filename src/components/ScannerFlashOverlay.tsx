import { StyleSheet, Text, View, Pressable } from 'react-native';

export type FlashState = 'idle' | 'success' | 'error' | 'duplicate';

interface ScannerFlashOverlayProps {
  state: FlashState;
  participantName?: string;
  ticketType?: string;
  timeInfo?: string;
  eventName?: string;
  locationName?: string;
  checkedInCount?: number;
  onPressToDismiss?: () => void;
}

export function ScannerFlashOverlay({
  state,
  participantName = 'Nadeesha Perera',
  ticketType = 'General Admission',
  timeInfo = 'Already scanned',
  eventName = 'Tech Summit 2026',
  locationName = 'Gate 2',
  checkedInCount = 1248,
  onPressToDismiss,
}: ScannerFlashOverlayProps) {
  if (state === 'idle') {
    return (
      <View style={styles.idleBottomCardContainer} pointerEvents="box-none">
        <View style={styles.idleCard}>
          <Text style={styles.idleEventTitle}>
            {eventName} · {locationName}
          </Text>
          <View style={styles.idleTallyRow}>
            <Text style={styles.idleTallyNumber}>{checkedInCount.toLocaleString()}</Text>
            <Text style={styles.idleTallyLabel}> checked in</Text>
          </View>
        </View>
      </View>
    );
  }

  const CONFIGS = {
    success: {
      bgColor: '#F96C15', // Tangerine Orange Flash
      icon: '✓',
      title: 'Checked in',
      subtitle: `${participantName} · ${ticketType}`,
    },
    error: {
      bgColor: '#D92D2D', // Crimson Red Flash
      icon: '✕',
      title: 'Not registered',
      subtitle: "This code isn't on the guest list",
    },
    duplicate: {
      bgColor: '#B4890F', // Gold Warning Flash
      icon: '!',
      title: 'Already checked in',
      subtitle: `${participantName} · ${timeInfo}`,
    },
  };

  const config = CONFIGS[state];

  return (
    <Pressable
      style={[styles.fullscreenFlash, { backgroundColor: config.bgColor }]}
      onPress={onPressToDismiss}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{config.icon}</Text>
      </View>
      <Text style={styles.flashTitle}>{config.title}</Text>
      <Text style={styles.flashSubtitle}>{config.subtitle}</Text>
      <Text style={styles.tapToDismissText}>Tap anywhere to resume scanning</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  idleBottomCardContainer: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    zIndex: 30,
  },
  idleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  idleEventTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 4,
  },
  idleTallyRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  idleTallyNumber: {
    fontSize: 24,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#184F95',
  },
  idleTallyLabel: {
    fontSize: 15,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },

  fullscreenFlash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  flashTitle: {
    fontSize: 34,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  flashSubtitle: {
    fontSize: 17,
    fontFamily: 'Urbanist_600SemiBold',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
  },
  tapToDismissText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 13,
    fontFamily: 'Urbanist_500Medium',
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
