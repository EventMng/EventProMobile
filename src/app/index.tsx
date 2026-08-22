import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { getToken } from '@/services/authStorage';

export default function Index() {
  const [destination, setDestination] = useState<'/(auth)/login' | '/(main)/events' | null>(null);

  useEffect(() => {
    getToken().then((token) => setDestination(token ? '/(main)/events' : '/(auth)/login'));
  }, []);

  if (!destination) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
