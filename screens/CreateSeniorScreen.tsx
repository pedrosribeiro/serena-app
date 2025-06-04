import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../context/AuthContext';
import { useSenior } from '../context/SeniorContext';

interface CreateSeniorScreenProps {
  token: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function CreateSeniorScreen({ token, onSuccess, onBack }: CreateSeniorScreenProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setSeniors, setSelectedSenior } = useSenior();

  const fetchAndSetSeniors = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/senior/by_user/${user.id}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const seniorsWithAge = data.map((senior: any) => {
            const [day, month, year] = senior.birth_date.split('/').map(Number);
            const birth = new Date(year, month - 1, day);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return { ...senior, age };
          });
          setSeniors(seniorsWithAge);
          setSelectedSenior(seniorsWithAge[0]);
        }
      }
    } catch {}
  };

  const handleCreate = async () => {
    setError('');
    if (!name || !birthDate || !deviceId) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/senior/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, birth_date: birthDate, device_id: deviceId }),
      });
      if (res.ok) {
        await fetchAndSetSeniors();
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.detail || 'Erro ao criar senior.');
      }
    } catch (e) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar novo Senior</Text>
        <Text style={styles.label}>Preencha os dados do Senior para criar e associar:</Text>
        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="Data de nascimento (dd/mm/aaaa)"
          value={birthDate}
          onChangeText={setBirthDate}
          editable={!loading}
        />
        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar Senior</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBack}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Voltar para seleção de Senior</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ecfa',
    padding: 24,
  },
  card: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
    alignSelf: 'center',
  },
  label: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e6f0',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#aaa',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2bb3c0',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b2e0e6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  secondaryButton: {
    backgroundColor: '#f5f8ff',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2bb3c0',
    marginTop: 4,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#2bb3c0',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
