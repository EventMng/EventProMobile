import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { api } from '@/services/api';
import type { AssignedEvent } from '@/types/participant';

interface EventItem extends AssignedEvent {
  statusBadge: { text: string; bg: string; color: string };
  subtitle: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt_tech_2026',
    name: 'Tech Summit 2026',
    location: 'Gate 2',
    eventDate: '2026-09-15',
    subtitle: 'Gate 2 · 1,248 checked in',
    statusBadge: { text: '● Live now', bg: '#FFEDD5', color: '#EA580C' },
  },
  {
    id: 'evt_alumni_2026',
    name: 'Alumni Meetup',
    location: 'Main hall',
    eventDate: '2026-10-01',
    subtitle: 'Main hall',
    statusBadge: { text: 'Starts 2:00 PM', bg: '#EFF6FF', color: '#2563EB' },
  },
];

export default function EventsScreen() {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get<AssignedEvent[]>('/api/events/assigned');
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map((item, idx) => ({
          ...item,
          subtitle: item.location || 'Main hall',
          statusBadge: idx === 0
            ? { text: '● Live now', bg: '#FFEDD5', color: '#EA580C' }
            : { text: 'Starts 2:00 PM', bg: '#EFF6FF', color: '#2563EB' },
        }));
        setEvents(formatted);
      }
    } catch {
      // Retain design system spec mock events
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <Text style={styles.headerTitle}>Your events</Text>
        <Text style={styles.headerSub}>Assigned to you today</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/(main)/scanner/${item.id}`)}
          >
            {/* Top Pill Badge */}
            <View style={[styles.badge, { backgroundColor: item.statusBadge.bg }]}>
              <Text style={[styles.badgeText, { color: item.statusBadge.color }]}>
                {item.statusBadge.text}
              </Text>
            </View>

            {/* Event Name */}
            <Text style={styles.eventName}>{item.name}</Text>

            {/* Event Subtitle */}
            <Text style={styles.eventSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 44,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  headerSub: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'flex-start',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  eventSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
