import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveToken, signIn, signUp } from '../api/auth';
import { useAuth, UserRole } from '../context/AuthContext';
import { useSenior } from '../context/SeniorContext';

const roles: { label: string; value: UserRole }[] = [
  { label: 'Caregiver', value: 'caregiver' },
  { label: 'Doctor', value: 'doctor' },
];

const defaultSeniors = [
  { id: '1', name: 'John Doe', age: 78 },
  { id: '2', name: 'Mary Smith', age: 82 },
  { id: '3', name: 'Carlos Silva', age: 80 },
];

export default function AuthForm() {
  const { setUser } = useAuth();
  const { setSelectedSenior } = useSenior();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('caregiver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedSenior(defaultSeniors[0]);
  }, []);

  const handleSubmit = async () => {
    setError('');
    // Bypass para desenvolvimento local mobile
    if (email === 'bypass') {
      setUser({
        id: '1',
        name: 'Test User',
        email: 'test@bypass.com',
        role: 'caregiver',
      });
      return;
    }
    if (!email || !password || (isSignUp && !name)) {
      setError('Fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await signUp({ name, email, password, role });
        await saveToken(res.token);
        if (!res.user) throw new Error('Usuário não retornado pela API');
        setUser({ id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role });
      } else {
        const res = await signIn({ email, password });
        await saveToken(res.token);
        if (!res.user) throw new Error('Usuário não retornado pela API');
        setUser({ id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role });
      }
    } catch (err: any) {
      if (isSignUp && (err.message?.toLowerCase().includes('email already registered'))) {
        setError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#e6ecfa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Topo decorativo */}
        <View style={styles.topDecoration}>
          <Image
            source={require('../assets/images/caregiver-elderly.jpg')}
            style={{ width: 320, height: 240, borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{isSignUp ? 'Create account' : 'Login'}</Text>
          {isSignUp && (
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
            />
          )}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ width: '100%' }}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            {!isSignUp && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Botões de seleção de role só aparecem no sign up */}
          {isSignUp && (
            <View style={styles.roleRow}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  style={[styles.roleBtn, role === r.value && styles.roleBtnActive]}
                >
                  <Text style={[styles.roleText, role === r.value && styles.roleTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.loginBtnText}>{loading ? 'Aguarde...' : isSignUp ? 'Sign up' : 'Log in'}</Text>
          </TouchableOpacity>
          <View style={styles.bottomRow}>
            <Text style={{ color: '#888' }}>{isSignUp ? 'Already have an account?' : "Don't have an account?"} </Text>
            <TouchableOpacity onPress={() => setIsSignUp((v) => !v)}>
              <Text style={styles.linkText}>{isSignUp ? 'Log in' : 'Create an account'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ecfa',
  },
  topDecoration: {
    width: 320,
    height: 240,
    backgroundColor: '#f5f8ff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginBottom: -32,
    alignSelf: 'center',
  },
  card: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
    color: '#222',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e6f0',
  },
  forgotBtn: {
    position: 'absolute',
    right: 0,
    top: 12,
  },
  forgotText: {
    color: '#2bb3c0',
    fontSize: 13,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  roleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#f5f8ff',
    marginHorizontal: 4,
  },
  roleBtnActive: {
    backgroundColor: '#2bb3c0',
  },
  roleText: {
    color: '#2bb3c0',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
  },
  loginBtn: {
    backgroundColor: '#2bb3c0',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#2bb3c0',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});
