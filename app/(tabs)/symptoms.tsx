import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../api/auth';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function SymptomsScreen() {
  const { user, logout } = useAuth();
  const { selectedSenior } = useSenior();
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchSymptoms = async () => {
      if (!selectedSenior) return;
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        if (!token) throw new Error('Unauthorized');
        const res = await fetch(`${API_BASE_URL}/symptoms/by_senior/${selectedSenior.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Erro ao carregar sintomas');
        const data = await res.json();
        setSymptoms(data);
      } catch (e) {
        setError('Erro ao carregar sintomas. Tente novamente.');
        setSymptoms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, [selectedSenior, isFocused]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function mapPainLevel(level: number) {
    if (level <= 3) return 'Leve';
    if (level <= 6) return 'Moderado';
    return 'Forte';
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Reported Symptoms</Text>
        {selectedSenior && (
          <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
        )}
        {loading ? (
          <Text style={styles.emptyText}>Carregando sintomas...</Text>
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : symptoms.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum sintoma registrado para este senior.</Text>
        ) : (
          symptoms.map((symptom) => (
            <View key={symptom.id} style={styles.symptomCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="heartbeat" size={28} color="#2bb3c0" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.symptomName}>{symptom.name}</Text>
                  <Text style={styles.symptomDate}>{formatDate(symptom.created_at)}</Text>
                </View>
              </View>
              <Text style={styles.severityLabel}>Nível de dor:</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>{mapPainLevel(symptom.pain_level)}</Text>
              </View>
              {symptom.description ? (
                <Text style={styles.symptomDesc}>{symptom.description}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  seniorLabel: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 18,
  },
  seniorName: {
    color: '#2bb3c0',
    fontFamily: 'Montserrat-Bold',
  },
  symptomCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  symptomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Montserrat-Bold',
  },
  symptomDate: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  severityLabel: {
    fontSize: 14,
    color: '#457B9D',
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  severityBadge: {
    backgroundColor: '#e6ecfa',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  severityText: {
    fontSize: 13,
    color: '#2bb3c0',
    fontFamily: 'Montserrat-Bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: 40,
  },
  symptomDesc: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
    marginTop: 8,
  },
});