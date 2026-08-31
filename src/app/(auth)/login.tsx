import AuthLoadingOverlay from '@/components/AuthLoadingOverlay';
import { api } from '@/services/api';
import { setToken, setUser } from '@/services/authStorage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Isolated Email Input ────────────────────────────────────────────────────
// Manages its own focus state so parent LoginScreen never re-renders on focus.
const EmailInput = memo(({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>Email Address</Text>
      <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
        <Ionicons
          name="mail-outline"
          size={20}
          color={focused ? '#184F95' : '#9CA3AF'}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="name@eventpro.com"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={true}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
});

// ─── Isolated Password Input ─────────────────────────────────────────────────
const PasswordInput = memo(({
  value,
  onChangeText,
  onSubmitEditing,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>Temporary Password</Text>
      <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={focused ? '#184F95' : '#9CA3AF'}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter temporary password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          returnKeyType="done"
          editable={true}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitEditing}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)}
          style={styles.eyeIcon}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ─── Login Screen ────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Authenticating...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your temporary password.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Authenticating...');
    setErrorMessage(null);

    try {
      const res = await api.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (res.data?.token) {
        await setToken(res.data.token);
        if (res.data.user) {
          await setUser(res.data.user);
        }
        setLoadingMessage('Login Successful!');
        setTimeout(() => {
          setLoading(false);
          router.replace('/(main)/events');
        }, 500);
      } else {
        setLoading(false);
        setErrorMessage('Authentication failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
      const serverMsg = err.response?.data?.error;
      if (serverMsg === 'Invalid credentials') {
        setErrorMessage('Invalid email or temporary password.');
      } else if (serverMsg) {
        setErrorMessage(serverMsg);
      } else {
        setErrorMessage('Unable to connect to server. Please try again.');
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Badge */}
        <View style={styles.headerContainer}>
          <View style={styles.badgeWrapper}>
            <View style={styles.epBadge}>
              <Ionicons name="qr-code-sharp" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.pillBadge}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>STAFF SCANNER</Text>
            </View>
          </View>

          <Text style={styles.title}>Frontman Sign In</Text>
          <Text style={styles.subtitle}>
            Use the temporary password issued by your event organizer.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formGroup}>
          <EmailInput value={email} onChangeText={setEmail} />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />

          {/* Error Card */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.continueButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.continueButtonText}>Signing in...</Text>
              </View>
            ) : (
              <View style={styles.buttonRow}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward-sharp" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#6B7280" />
            <Text style={styles.footerText}>Secure Frontman Authentication</Text>
          </View>
        </View>
      </ScrollView>

      <AuthLoadingOverlay
        visible={loading}
        message={loadingMessage}
        subMessage="Verifying staff credentials and securing connection"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  headerContainer: {
    marginBottom: 32,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  epBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#184F95',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#184F95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#184F95',
    marginRight: 6,
  },
  pillText: {
    fontSize: 11,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#184F95',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist_800ExtraBold',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  formGroup: {
    gap: 20,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Urbanist_700Bold',
    color: '#374151',
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#184F95',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#111827',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E8',
    borderWidth: 1,
    borderColor: '#F87171',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#9B1C1C',
    fontSize: 13,
    fontFamily: 'Urbanist_600SemiBold',
  },
  continueButton: {
    backgroundColor: '#184F95',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#184F95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
  },
  footer: {
    marginTop: 36,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
});
