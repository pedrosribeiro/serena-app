import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

// Exemplo de idosos sob cuidado, substituir por dados reais futuramente
const seniors = [
  { id: '1', name: 'John Doe', age: 78 },
  { id: '2', name: 'Mary Smith', age: 82 },
  { id: '3', name: 'Carlos Silva', age: 80 },
];

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { selectedSenior, setSelectedSenior } = useSenior();
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  // Funções de troca de idioma e tema podem ser integradas com contexto futuramente

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Senior</Text>
        {seniors.map((senior) => (
          <TouchableOpacity
            key={senior.id}
            style={[styles.seniorButton, selectedSenior?.id === senior.id && styles.seniorButtonSelected]}
            onPress={() => setSelectedSenior(senior)}
          >
            <Text style={[styles.seniorName, selectedSenior?.id === senior.id && styles.seniorButtonSelectedText]}>{senior.name} ({senior.age} yrs)</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.langButton, language === 'en' && styles.langButtonSelected]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langButtonSelectedText]}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === 'pt' && styles.langButtonSelected]}
            onPress={() => setLanguage('pt')}
          >
            <Text style={[styles.langText, language === 'pt' && styles.langButtonSelectedText]}>Português</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Theme</Text>
        <View style={styles.row}>
          <Text style={styles.themeText}>{darkMode ? 'Dark' : 'Light'} mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fcff',
    paddingVertical: 32,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2bb3c0',
    marginBottom: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#457B9D',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  seniorButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#e6ecfa',
    marginBottom: 8,
  },
  seniorButtonSelected: {
    backgroundColor: '#2bb3c0',
  },
  seniorName: {
    color: '#222',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  },
  // Ajuste para texto branco quando selecionado
  seniorButtonSelectedText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  langButton: {
    backgroundColor: '#e6ecfa',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  langButtonSelected: {
    backgroundColor: '#2bb3c0',
  },
  langText: {
    color: '#222',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  },
  langButtonSelectedText: {
    color: '#fff',
  },
  themeText: {
    color: '#222',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});