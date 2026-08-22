import { StyleSheet, Text, View } from 'react-native';

import type { ScannerVerifyResponse } from '@/types/api';

export function ParticipantSheet({ result }: { result: ScannerVerifyResponse }) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.name}>{result.participant.fullName}</Text>
      <Text style={styles.email}>{result.participant.email}</Text>
      <Text style={styles.event}>{result.event.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 4,
  },
  name: { fontSize: 18, fontWeight: '700' },
  email: { fontSize: 14, color: '#666' },
  event: { fontSize: 13, color: '#999', marginTop: 8 },
});
