import { StyleSheet, Text, View } from 'react-native';

type Status = 'idle' | 'success' | 'error' | 'already-marked';

const LABELS: Record<Status, string> = {
  idle: 'Ready to scan',
  success: 'Attendance marked',
  error: 'Invalid QR code',
  'already-marked': 'Already checked in',
};

const COLORS: Record<Status, string> = {
  idle: '#888',
  success: '#2e7d32',
  error: '#c62828',
  'already-marked': '#ef6c00',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <View style={[styles.badge, { backgroundColor: COLORS[status] }]}>
      <Text style={styles.text}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'center' },
  text: { color: '#fff', fontWeight: '600' },
});
