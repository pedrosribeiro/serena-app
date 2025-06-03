import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

const API_URL = API_BASE_URL; // Use a base centralizada

export async function signUp({ name, email, password, role }: { name: string; email: string; password: string; role: string }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
      role
    })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'Erro ao registrar');
  }
  const data = await response.json();
  // API retorna token e user
  return { token: data.access_token, user: data.user };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: email,
      password
    }).toString()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'Credenciais inválidas');
  }
  const data = await response.json();
  // API retorna token e user
  return { token: data.access_token, user: data.user };
}

export async function saveToken(token: string) {
  await AsyncStorage.setItem('authToken', token);
}

export async function getToken() {
  return AsyncStorage.getItem('authToken');
}

export async function removeToken() {
  await AsyncStorage.removeItem('authToken');
}
