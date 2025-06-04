import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from '../api/auth';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../context/AuthContext';
import CreateSeniorScreen from './CreateSeniorScreen';
import RelateSeniorScreen from './RelateSeniorScreen';

export default function SeniorGate() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasSenior, setHasSenior] = useState<boolean | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSenior = async () => {
      if (!user) return;
      setLoading(true);
      const t = await getToken();
      setToken(t);
      try {
        const res = await fetch(`${API_BASE_URL}/senior/by_user/${user.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${t}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setHasSenior(Array.isArray(data) && data.length > 0);
        } else {
          setHasSenior(false);
        }
      } catch {
        setHasSenior(false);
      } finally {
        setLoading(false);
      }
    };
    checkSenior();
  }, [user]);

  // Redireciona para home apenas via efeito, evitando loop infinito
  useEffect(() => {
    if (hasSenior && !redirecting) {
      setRedirecting(true);
      router.replace('/(tabs)');
    }
  }, [hasSenior, redirecting, router]);

  if (loading || !token || redirecting) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" />;</View>;
  if (!user) return null;
  // Sempre mostra a tela de relacionar-se a um senior primeiro
  if (!hasSenior) {
    return (
      <RelateSeniorScreen
        userId={user.id}
        token={token}
        onSuccess={() => setHasSenior(true)}
        onCreateSenior={() => setShowCreate(true)}
      />
    );
  }
  if (showCreate) {
    return <CreateSeniorScreen token={token} onSuccess={() => setHasSenior(true)} />;
  }
  return null;
}
