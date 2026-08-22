import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { setToken } from '@/services/authStorage';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await setToken('demo-token-active');
      router.replace('/(main)/events');
    } catch {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Warning Pill */}
      <View style={styles.warningPill}>
        <Text style={styles.warningPillText}>Password expired</Text>
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>Set a new password</Text>
      <Text style={styles.subtitle}>
        Required before your first check-in shift.
      </Text>

      {/* Form Fields */}
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.actionButtonText}>
            {loading ? 'Updating...' : 'Set password & continue'}
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
  },
  warningPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  warningPillText: {
    color: '#B4890F',
    fontSize: 13,
    fontWeight: '700',
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
  actionButton: {
    backgroundColor: '#184F95',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
