import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { api } from '@/services/api';
import type { AssignedEvent } from '@/types/participant';

export default function EventsScreen() {
  const [events, setEvents] = useState<AssignedEvent[]>([]);

  useEffect(() => {
    api.get<AssignedEvent[]>('/api/events/assigned').then((res) => setEvents(res.data));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push(`/(main)/scanner/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            {item.location && <Text style={styles.location}>{item.location}</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 16, fontWeight: '600' },
  location: { fontSize: 13, color: '#666' },
});
