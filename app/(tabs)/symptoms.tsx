import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function SymptomsScreen() {
  const { user } = useAuth();
  const { selectedSenior } = useSenior();
  // Exemplo de sintomas relatados, substituir por dados reais futuramente
  const symptoms = [
    { id: 1, name: 'Headache', date: '10/05/2025', severity: 'Slight' },
    { id: 2, name: 'Nausea', date: '09/05/2025', severity: 'Moderate' },
    { id: 3, name: 'Cramps', date: '09/05/2025', severity: 'Strong' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Reported Symptoms</Text>
      {selectedSenior && (
        <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
      )}
      {symptoms.length === 0 ? (
        <Text style={styles.emptyText}>No symptoms reported by the senior so far.</Text>
      ) : (
        symptoms.map((symptom) => (
          <View key={symptom.id} style={styles.symptomCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="heartbeat" size={28} color="#2bb3c0" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.symptomName}>{symptom.name}</Text>
                <Text style={styles.symptomDate}>{symptom.date}</Text>
              </View>
            </View>
            <Text style={styles.severityLabel}>Severity:</Text>
            <View style={styles.severityBadge}>
              <Text style={styles.severityText}>{symptom.severity}</Text>
            </View>
          </View>
        ))
      )}
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
});