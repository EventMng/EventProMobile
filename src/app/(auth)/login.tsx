import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { setToken } from '@/services/authStorage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    await setToken('demo-token');
    setLoading(false);
    // Frontmen sign in with the temporary password an Org Admin issued them
    // and keep using it as-is for the assigned event — there's no forced
    // reset step. The Org Admin revokes/reissues it (e.g. once the event
    // ends), not the Frontman.
    router.replace('/(main)/events');
  }

  return (
    <View style={styles.container}>
      {/* Blue Square EP Badge Icon */}
      <View style={styles.epBadge}>
        <Text style={styles.epBadgeText}>EP</Text>
      </View>

      {/* Main Title & Subtitle matching design spec */}
      <Text style={styles.title}>Frontman sign in</Text>
      <Text style={styles.subtitle}>
        Use the temporary password from your organizer.
      </Text>

      {/* Inputs */}
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Temporary password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Primary Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Signing in...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    justifyContent: 'center',
    fontFamily: 'Urbanist_400Regular',
  },
  epBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#184F95',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  epBadgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Urbanist_800ExtraBold',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 32,
  },
  formGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#111827',
  },
  continueButton: {
    backgroundColor: '#184F95',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
  },
});
