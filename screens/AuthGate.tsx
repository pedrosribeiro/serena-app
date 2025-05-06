import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function AuthGate() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Always redirect to the main tab after login or reload
      router.replace('/(tabs)');
    }
  }, [user]);

  if (!user) {
    return <AuthForm />;
  }
  // Enquanto redireciona, pode exibir um loading vazio
  return <View />;
}
