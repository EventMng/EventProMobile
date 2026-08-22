import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface AssignedEventItem {
  id: string;
  name: string;
  subtitle: string;
  statusPill: string;
  statusType: 'live' | 'upcoming';
}

const EVENTS_DATA: AssignedEventItem[] = [
  {
    id: 'sample-event-id',
    name: 'Tech Summit 2026',
    subtitle: 'Gate 2 · 1,248 checked in',
    statusPill: '● Live now',
    statusType: 'live',
  },
  {
    id: 'sample-event-id-2',
    name: 'Alumni Meetup',
    subtitle: 'Main hall',
    statusPill: 'Starts 2:00 PM',
    statusType: 'upcoming',
  },
];

export default function EventsScreen() {
  function handleSelectEvent(eventId: string) {
    router.push({
      pathname: '/(main)/scanner/[eventId]',
      params: { eventId },
    });
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <Text style={styles.title}>Your events</Text>
        <Text style={styles.subtitle}>Assigned to you today</Text>
      </View>

      {/* Events List */}
      <FlatList
        data={EVENTS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleSelectEvent(item.id)}
          >
            {/* Status Pill Badge */}
            <View style={styles.pillContainer}>
              <View
                style={[
                  styles.pill,
                  item.statusType === 'live'
                    ? styles.pillLive
                    : styles.pillUpcoming,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    item.statusType === 'live'
                      ? styles.pillTextLive
                      : styles.pillTextUpcoming,
                  ]}
                >
                  {item.statusPill}
                </Text>
              </View>
            </View>

            {/* Event Title & Subtitle */}
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventSubtitle}>{item.subtitle}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 44,
  },
  header: {
    marginBottom: 28,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Urbanist_700Bold',
    color: '#111827',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  pillContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  pillLive: {
    backgroundColor: '#FFEDD5',
  },
  pillUpcoming: {
    backgroundColor: '#EFF6FF',
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
  },
  pillTextLive: {
    color: '#EA580C',
  },
  pillTextUpcoming: {
    color: '#2563EB',
  },
  eventName: {
    fontSize: 19,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
  },
});
