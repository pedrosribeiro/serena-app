// Mocked API utility for authentication (in-memory)
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory users DB
const users: Record<string, { name: string; email: string; password: string; role: string; id: string }> = {
  'admin@serena.com': {
    id: '1',
    name: 'Admin',
    email: 'admin@serena.com',
    password: 'admin123',
    role: 'caregiver',
  },
};

function generateToken(user: any) {
  // Just a mock token
  return `mock-token-for-${user.email}`;
}

export async function signUp({ name, email, password, role }: { name: string; email: string; password: string; role: string }) {
  if (users[email]) {
    throw new Error('Email já cadastrado');
  }
  const id = (Object.keys(users).length + 1).toString();
  users[email] = { id, name, email, password, role };
  const token = generateToken(users[email]);
  return { token, user: { id, name, email, role } };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const user = users[email];
  if (!user || user.password !== password) {
    throw new Error('Credenciais inválidas');
  }
  const token = generateToken(user);
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
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
