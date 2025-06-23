import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function ReportsScreen() {
  const { user } = useAuth();
  const { selectedSenior } = useSenior();
  // Exemplo de dados simulados, substituir por dados reais futuramente
  const senior = {
    name: 'John Doe',
    age: 78,
    identifier: '123456789',
    doctors: [
      { name: 'Dr. Alice Smith', specialty: 'Geriatrics' },
      { name: 'Dr. Bob Brown', specialty: 'Cardiology' },
    ],
    prescriptions: [
      { name: 'Paracetamol', dosage: '500mg', times: ['08:00', '14:00', '20:00'] },
      { name: 'Aspirin', dosage: '100mg', times: ['10:00', '22:00'] },
    ],
    symptoms: [
      { name: 'Headache', date: '10/05/2025', time: '09:00', severity: 'Slight' },
      { name: 'Nausea', date: '09/05/2025', time: '15:00', severity: 'Moderate' },
    ],
    medicationHistory: [
      { name: 'Paracetamol', date: '10/05/2025', time: '08:00', taken: true },
      { name: 'Paracetamol', date: '10/05/2025', time: '14:00', taken: false },
      { name: 'Aspirin', date: '09/05/2025', time: '10:00', taken: true },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Relatório do Idoso</Text>
        {selectedSenior && (
          <Text style={styles.seniorLabel}>Visualizando dados de: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
        )}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações Pessoais</Text>
          <Text style={styles.infoText}>Nome: {senior.name}</Text>
          <Text style={styles.infoText}>Idade: {senior.age}</Text>
          <Text style={styles.infoText}>Identificador: {senior.identifier}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Médicos</Text>
          {senior.doctors.map((doc, i) => (
            <Text key={i} style={styles.infoText}>{doc.name} ({doc.specialty})</Text>
          ))}
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tratamento Atual</Text>
          {senior.prescriptions.map((med, i) => (
            <Text key={i} style={styles.infoText}>{med.name} {med.dosage} - {med.times.join(', ')}</Text>
          ))}
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Sintomas Reportados</Text>
          {senior.symptoms.length === 0 ? (
            <Text style={styles.infoText}>Nenhum sintoma reportado.</Text>
          ) : (
            senior.symptoms.map((s, i) => (
              <Text key={i} style={styles.infoText}>{s.name} - {s.severity} ({s.date} às {s.time})</Text>
            ))
          )}
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Histórico de Medicação</Text>
          {senior.medicationHistory.length === 0 ? (
            <Text style={styles.infoText}>Nenhum histórico de medicação disponível.</Text>
          ) : (
            senior.medicationHistory.map((m, i) => (
              <Text key={i} style={styles.infoText}>
                {m.name} - {m.date} às {m.time}: {m.taken ? 'Tomado' : 'Perdido'}
              </Text>
            ))
          )}
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={() => alert('Funcionalidade de exportação de relatório!')}>
          <FontAwesome5 name="file-export" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.exportButtonText}>Exportar como PDF</Text>
        </TouchableOpacity>
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#457B9D',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  infoText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 2,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 4,
  },
});