import AuthLoadingOverlay from '@/components/AuthLoadingOverlay';
import { getToken } from '@/services/authStorage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  async function checkInitialAuth() {
    try {
      const token = await getToken();
      // Add slight delay for smooth visual transition
      await new Promise((res) => setTimeout(res, 600));
      if (token) {
        router.replace('/(main)/events');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (err) {
      console.error('Failed to verify initial auth token:', err);
      router.replace('/(auth)/login');
    } finally {
      setCheckingAuth(false);
    }
  }

  return (
    <View style={styles.loadingContainer}>
      <AuthLoadingOverlay
        visible={checkingAuth}
        message="Loading EventPro"
        subMessage="Checking active session and initializing..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

 