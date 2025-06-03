import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import SeniorGate from './SeniorGate';

export default function AuthGate() {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }
  return <SeniorGate />;
}
