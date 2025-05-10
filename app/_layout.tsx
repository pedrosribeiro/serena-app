// app/_layout.tsx
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SeniorProvider } from '../context/SeniorContext';
import AuthGate from '../screens/AuthGate';

export default function RootLayout() {
  const [loaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SeniorProvider>
        <AuthContent />
        <StatusBar style="auto" />
      </SeniorProvider>
    </AuthProvider>
  );
}

function AuthContent() {
  const { user, loading } = useAuth();
  if (loading) {
    // Show a loading indicator while checking auth state
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }
  if (!user) {
    return <AuthGate />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
