import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getToken } from '../../api/auth';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

function generateTimes(frequency: string, startDate: string, endDate: string) {
  // frequency em horas, ex: "8" => a cada 8h
  const freq = parseInt(frequency, 10);
  if (!freq || freq <= 0 || freq > 24) return [];
  const times: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Gera horários apenas para um dia, a partir da hora de start_date
  let hour = start.getHours();
  const count = Math.floor(24 / freq);
  for (let i = 0; i < count; i++) {
    times.push((hour < 10 ? '0' : '') + hour + ':00');
    hour = (hour + freq) % 24;
  }
  return times;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export default function PrescriptionsScreen() {
  const { logout, user } = useAuth();
  const { selectedSenior } = useSenior();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!selectedSenior) return;
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        if (!token) throw new Error('Unauthorized');
        const res = await fetch(`${API_BASE_URL}/prescriptions/by_senior/${selectedSenior.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Erro ao carregar prescrições');
        const data = await res.json();
        setPrescriptions(data);
      } catch (e) {
        setError('Erro ao carregar prescrições. Tente novamente.');
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [selectedSenior, isFocused]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Prescriptions for the Senior</Text>
      {selectedSenior && (
        <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
      )}
      {loading ? (
        <Text style={styles.emptyText}>Carregando prescrições...</Text>
      ) : error ? (
        <Text style={styles.emptyText}>{error}</Text>
      ) : prescriptions.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma prescrição registrada para este senior.</Text>
      ) : (
        prescriptions.map((med) => (
          <View key={med.id} style={styles.prescriptionCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="pills" size={28} color="#2bb3c0" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.medName}>{med.medication?.name || 'Medicamento'}</Text>
                <Text style={styles.dosage}>{med.dosage}</Text>
                {med.doctor?.name && (
                  <Text style={styles.doctorName}>Prescrito por: {med.doctor.name}</Text>
                )}
              </View>
            </View>
            <Text style={styles.timesLabel}>Frequência: a cada {med.frequency}h</Text>
            <View style={styles.timesRow}>
              {generateTimes(med.frequency, med.start_date, med.end_date).map((t, i) => (
                <View key={i} style={styles.timeBadge}>
                  <Text style={styles.timeText}>{t}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.timesLabel}>Período:</Text>
            <Text style={styles.dosage}>{formatDate(med.start_date)} até {formatDate(med.end_date)}</Text>
            {med.description ? (
              <Text style={styles.dosage}>{med.description}</Text>
            ) : null}
          </View>
        ))
      )}
      {user?.role === 'doctor' && (
        <TouchableOpacity style={styles.editButton} onPress={() => alert('Prescription editing functionality!')}>
          <Text style={styles.editButtonText}>Edit prescriptions</Text>
        </TouchableOpacity>
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
  doctorName: {
    fontSize: 14,
    color: '#457B9D',
    marginTop: 4,
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
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginTop: 20,
  },
});