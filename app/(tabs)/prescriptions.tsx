import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function PrescriptionsScreen() {
  const { user } = useAuth();
  const { selectedSenior } = useSenior();
  // Exemplo de prescrições, substituir por dados reais futuramente
  const prescriptions = [
    { id: 1, name: 'Paracetamol', dosage: '500mg', times: ['08:00', '14:00', '20:00'] },
    { id: 2, name: 'Aspirin', dosage: '100mg', times: ['10:00', '22:00'] },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Prescriptions for the Senior</Text>
      {selectedSenior && (
        <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
      )}
      {prescriptions.map((med) => (
        <View key={med.id} style={styles.prescriptionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="pills" size={28} color="#2bb3c0" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.dosage}>{med.dosage}</Text>
            </View>
          </View>
          <Text style={styles.timesLabel}>Times:</Text>
          <View style={styles.timesRow}>
            {med.times.map((t, i) => (
              <View key={i} style={styles.timeBadge}>
                <Text style={styles.timeText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.editButton} onPress={() => alert('Prescription editing functionality!')}>
        <Text style={styles.editButtonText}>Edit prescriptions</Text>
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
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Montserrat-Bold',
  },
  dosage: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  timesLabel: {
    fontSize: 14,
    color: '#457B9D',
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  timeBadge: {
    backgroundColor: '#e6ecfa',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#2bb3c0',
    fontFamily: 'Montserrat-Bold',
  },
  editButton: {
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});