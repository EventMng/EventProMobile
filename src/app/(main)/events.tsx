import { api } from '@/services/api';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUser, clearToken } from '@/services/authStorage';

interface EventItem {
  id: string;
  name: string;
  location: string | null;
  eventDate: string;
  status: 'Live' | 'Upcoming' | 'Completed';
  totalRegistrations: number;
  checkedInCount: number;
}

export default function EventsScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserAndEvents();
  }, []);

  async function loadUserAndEvents() {
    const u = await getUser();
    if (u) setUser(u);
    await fetchEvents();
  }

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<EventItem[]>('/api/events');
      setEvents(res.data || []);
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setError('Failed to load assigned events from server');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await clearToken();
    router.replace('/(auth)/login');
  }

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.title}>Assigned Events</Text>
            <Text style={styles.subtitle}>
              {user ? `Logged in as ${user.fullName || user.email}` : 'Events assigned to your frontman profile'}
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#184F95" />
          <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>Loading assigned events...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: '#DC2626', fontSize: 15, fontWeight: '600', textAlign: 'center' }}>{error}</Text>
          <Pressable onPress={fetchEvents} style={{ marginTop: 16, backgroundColor: '#184F95', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Try Again</Text>
          </Pressable>
        </View>
      ) : events.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: '#111827', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            No Events Assigned
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>
            An Organization Admin must assign your profile to an event as a Frontman before it will appear here.
          </Text>
          <Pressable onPress={fetchEvents} style={{ backgroundColor: '#184F95', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Refresh List</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isLive = item.status === 'Live';
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectEvent(item.id)}
              >
                {/* Status Pill Badge */}
                <View style={styles.pillContainer}>
                  <View style={[styles.pill, isLive ? styles.pillLive : styles.pillUpcoming]}>
                    <Text style={[styles.pillText, isLive ? styles.pillTextLive : styles.pillTextUpcoming]}>
                      {isLive ? '● Live now' : 'Upcoming'}
                    </Text>
                  </View>
                </View>

                {/* Event Title & Subtitle */}
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.eventSubtitle}>
                  {item.location || 'Main Venue'} · {item.checkedInCount} of {item.totalRegistrations} checked in
                </Text>
              </Pressable>
            );
          }}
        />
      )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
  },
  logoutBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutBtnText: {
    fontSize: 13,
    fontFamily: 'Urbanist_700Bold',
    color: '#374151',
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
