// app/_layout.tsx
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import { getToken } from '../api/auth';
import { API_BASE_URL } from '../constants/api';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SeniorProvider } from '../context/SeniorContext';
import AuthGate from '../screens/AuthGate';
import CreateSeniorScreen from '../screens/CreateSeniorScreen';
import RelateSeniorScreen from '../screens/RelateSeniorScreen';

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
        <AuthGateWrapper />
        <StatusBar style="auto" />
      </SeniorProvider>
    </AuthProvider>
  );
}

function AuthGateWrapper() {
  const { user, loading: authLoading, logout } = useAuth();
  const [seniorLoading, setSeniorLoading] = useState(false);
  const [hasSenior, setHasSenior] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');

  // Sempre verifica token antes de qualquer requisição protegida
  useEffect(() => {
    const fetchTokenAndSenior = async () => {
      setError('');
      if (!user) return;
      setSeniorLoading(true);
      const t = await getToken();
      if (!t) {
        await logout();
        setSeniorLoading(false);
        return;
      }
      setToken(t);
      try {
        const res = await fetch(`${API_BASE_URL}/senior/by_user/${user.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${t}`,
          },
        });
        if (res.status === 401) {
          await logout();
          setSeniorLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setHasSenior(Array.isArray(data) && data.length > 0);
        } else {
          setHasSenior(false);
        }
      } catch {
        setError('Erro de conexão.');
        setHasSenior(false);
      } finally {
        setSeniorLoading(false);
      }
    };
    if (user) fetchTokenAndSenior();
  }, [user, logout]);

  if (authLoading || seniorLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }
  if (!user || !token) {
    return <AuthGate />;
  }
  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}><Text style={{ color: 'red', fontSize: 16 }}>{error}</Text></View>;
  }
  if (!hasSenior) {
    if (showCreate) {
      return <CreateSeniorScreen token={token} onSuccess={() => setHasSenior(true)} />;
    }
    return <RelateSeniorScreen userId={user.id} token={token} onSuccess={() => setHasSenior(true)} onCreateSenior={() => setShowCreate(true)} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
