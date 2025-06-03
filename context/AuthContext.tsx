import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '../api/auth';

// Tipos de usuário e paciente
export type UserRole = 'caregiver' | 'doctor';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export interface Patient {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user and token from storage on mount, and validate token
  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await getToken();
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
        await removeToken();
      }
      setLoading(false);
    })();
  }, []);

  // Função robusta de logout
  const logout = async () => {
    setUser(null);
    await removeToken();
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, selectedPatient, setSelectedPatient, patients, setPatients, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
