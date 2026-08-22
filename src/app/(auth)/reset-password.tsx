import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleReset() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(main)/events');
    }, 400);
  }

  return (
    <View style={styles.container}>
      {/* Yellow/Beige Password Expired Pill */}
      <View style={styles.expiredBadge}>
        <Text style={styles.expiredBadgeText}>Password expired</Text>
      </View>

      {/* Title & Subtitle matching design spec */}
      <Text style={styles.title}>Set a new password</Text>
      <Text style={styles.subtitle}>
        Required before your first check-in shift.
      </Text>

      {/* Inputs */}
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

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
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
  expiredBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  expiredBadgeText: {
    color: '#B4890F',
    fontSize: 13,
    fontFamily: 'Urbanist_700Bold',
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
  submitButton: {
    backgroundColor: '#184F95',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
  },
});
