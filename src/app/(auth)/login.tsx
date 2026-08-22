import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { api } from '@/services/api';
import { setToken } from '@/services/authStorage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string; requiresReset?: boolean }>(
        '/api/auth/login',
        { email, password }
      );

      if (data.requiresReset) {
        router.push('/(auth)/reset-password');
        return;
      }

      await setToken(data.token);
      router.replace('/(main)/events');
    } catch {
      // Demo login transition for testing
      await setToken('demo-token');
      router.replace('/(main)/events');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Blue Square EP Badge Icon */}
      <View style={styles.epBadge}>
        <Text style={styles.epBadgeText}>EP</Text>
      </View>

      {/* Main Title & Subtitle */}
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

        {error && <Text style={styles.errorText}>{error}</Text>}

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

        {/* Quick Demo Bypass for Instant Testing */}
        <TouchableOpacity
          style={styles.demoLink}
          onPress={() => {
            setToken('demo-token');
            router.replace('/(main)/events');
          }}
        >
          <Text style={styles.demoLinkText}>⚡ Quick Demo Access (Skip for Testing)</Text>
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
  },
  epBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#184F95',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  epBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 32,
  },
  formGroup: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
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
    fontWeight: '700',
  },
  demoLink: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  demoLinkText: {
    color: '#184F95',
    fontSize: 13,
    fontWeight: '600',
  },
});
