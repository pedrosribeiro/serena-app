import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../constants/api';

interface RelateSeniorScreenProps {
  userId: string;
  token: string;
  onSuccess: () => void;
  onCreateSenior: () => void;
}

export default function RelateSeniorScreen({ userId, token, onSuccess, onCreateSenior }: RelateSeniorScreenProps) {
  const [seniorId, setSeniorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRelate = async () => {
    setError('');
    if (!seniorId) {
      setError('Informe o ID do senior.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/senior/relate_user_senior/?user_id=${userId}&senior_id=${seniorId}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.detail || 'Erro ao relacionar.');
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
        <Text style={styles.title}>Relacionar-se a um Senior</Text>
        <Text style={styles.label}>Informe o ID do Senior que deseja gerenciar:</Text>
        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="ID do Senior"
          value={seniorId}
          onChangeText={setSeniorId}
          autoCapitalize="none"
          editable={!loading}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRelate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Relacionar</Text>}
        </TouchableOpacity>
        <Text style={styles.orText}>ou</Text>
        <TouchableOpacity
          style={[styles.secondaryButton, loading && styles.buttonDisabled]}
          onPress={onCreateSenior}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Criar novo Senior</Text>
        </TouchableOpacity>
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
  orText: {
    color: '#888',
    marginVertical: 8,
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#f5f8ff',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2bb3c0',
  },
  secondaryButtonText: {
    color: '#2bb3c0',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
