import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    alert(`Modo escuro ${!darkMode ? 'ativado' : 'desativado'}`);
  };

  const handleSignOut = () => {
    setUser(null);
    router.replace('/'); // Redirect to AuthGate/login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Button title="Trocar Idioma" onPress={() => alert('Idioma alterado!')} />
      <Button title={`Modo Escuro: ${darkMode ? 'Ativado' : 'Desativado'}`} onPress={toggleDarkMode} />
      <Button title="Sair" color="#e74c3c" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});