import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    alert(`Modo escuro ${!darkMode ? 'ativado' : 'desativado'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Button title="Trocar Idioma" onPress={() => alert('Idioma alterado!')} />
      <Button title={`Modo Escuro: ${darkMode ? 'Ativado' : 'Desativado'}`} onPress={toggleDarkMode} />
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