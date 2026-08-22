import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { api } from '@/services/api';
import { setToken } from '@/services/authStorage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    try {
      const { data } = await api.post<{ token: string }>('/api/auth/login', { email, password });
      await setToken(data.token);
      router.replace('/(main)/events');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Temporary password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <TextInput editable={false} style={styles.error} value={error} />}
      <Button title="Log in" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  error: { color: 'red' },
});
