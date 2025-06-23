import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

function parseDateInput(input: string): string | null {
  // Aceita dd/mm/yyyy e retorna ISO string ou null se inválido
  const parts = input.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  // JS: mês começa em 0
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDateTimeInput(input: string): string | null {
  // Aceita dd/mm/yyyy HH:mm ou dd/mm/yyyy (retorna ISO string ou null se inválido)
  const [datePart, timePart] = input.trim().split(' ');
  if (!datePart) return null;
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  let hours = 0, minutes = 0;
  if (timePart) {
    const [h, m] = timePart.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    hours = h;
    minutes = m;
  }
  // Corrige para UTC local (mantém o horário digitado como local, não UTC)
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  if (isNaN(date.getTime())) return null;
  // Retorna string sem fuso (YYYY-MM-DDTHH:mm:00)
  return date.toISOString().slice(0, 16);
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '';
  // Aceita tanto ISO quanto timestamp puro
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateStr)) {
    // Força parse como local (corrige fuso)
    const [d, t] = dateStr.split('T');
    const [year, month, day] = d.split('-').map(Number);
    const [hour, min] = t.split(':').map(Number);
    date = new Date(year, month - 1, day, hour, min);
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(dateStr)) {
    date = new Date(dateStr.replace(' ', 'T'));
  } else {
    return dateStr;
  }
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function PrescriptionsScreen() {
  const { logout, user } = useAuth();
  const { selectedSenior } = useSenior();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [medicationsLoading, setMedicationsLoading] = useState(false);
  const [medicationsError, setMedicationsError] = useState('');
  const [form, setForm] = useState({
    medication_id: '',
    dosage: '',
    frequency: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
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

  // Carrega medicamentos ao abrir modal
  useEffect(() => {
    if (!modalVisible) return;
    setMedicationsLoading(true);
    setMedicationsError('');
    (async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_BASE_URL}/medications/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedications(res.data);
      } catch (e) {
        setMedicationsError('Erro ao carregar medicamentos.');
      } finally {
        setMedicationsLoading(false);
      }
    })();
  }, [modalVisible]);

  function openCreateModal() {
    setEditingPrescription(null);
    setForm({
      medication_id: '',
      dosage: '',
      frequency: '',
      start_date: '',
      end_date: '',
      description: '',
    });
    setModalVisible(true);
  }

  function openEditModal(prescription: any) {
    setEditingPrescription(prescription);
    // Formata para dd/mm/yyyy HH:mm ao abrir o modal
    setForm({
      medication_id: prescription.medication?.id || '',
      dosage: prescription.dosage || '',
      frequency: prescription.frequency || '',
      start_date: formatDateTime(prescription.start_date),
      end_date: formatDateTime(prescription.end_date),
      description: prescription.description || '',
    });
    setModalVisible(true);
  }

  function handleFormChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    return (
      form.medication_id &&
      form.dosage &&
      form.frequency &&
      form.start_date &&
      form.end_date
    );
  }

  async function handleSave() {
    if (!validateForm() || !selectedSenior) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    // Converte datas para ISO
    const startISO = parseDateTimeInput(form.start_date);
    const endISO = parseDateTimeInput(form.end_date);
    if (!startISO || !endISO) {
      alert('Datas inválidas. Use o formato dd/mm/yyyy HH:mm.');
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      if (editingPrescription) {
        // Editar
        await axios.put(
          `${API_BASE_URL}/prescriptions/${editingPrescription.id}`,
          {
            ...form,
            start_date: startISO,
            end_date: endISO,
            senior_id: selectedSenior.id,
            doctor_id: user?.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Prescrição atualizada com sucesso!');
      } else {
        // Criar
        await axios.post(
          `${API_BASE_URL}/prescriptions/`,
          {
            ...form,
            start_date: startISO,
            end_date: endISO,
            senior_id: selectedSenior.id,
            doctor_id: user?.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Prescrição criada com sucesso!');
      }
      setModalVisible(false);
      setEditingPrescription(null);
      setForm({ medication_id: '', dosage: '', frequency: '', start_date: '', end_date: '', description: '' });
      // Recarrega lista
      const res = await fetch(`${API_BASE_URL}/prescriptions/by_senior/${selectedSenior.id}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPrescriptions(await res.json());
    } catch (e) {
      alert('Erro ao salvar prescrição.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(prescription: any) {
    if (!selectedSenior) return;
    setLoading(true);
    setModalVisible(false); // Fecha modal se estiver aberto
    try {
      const token = await getToken();
      await axios.delete(`${API_BASE_URL}/prescriptions/${prescription.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Prescrição excluída com sucesso!');
      // Recarrega lista
      const res = await fetch(`${API_BASE_URL}/prescriptions/by_senior/${selectedSenior.id}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPrescriptions(await res.json());
    } catch (e) {
      alert('Erro ao excluir prescrição.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Prescrições do Idoso</Text>
        {user?.role === 'doctor' && (
          <TouchableOpacity style={styles.editButton} onPress={openCreateModal}>
            <Text style={styles.editButtonText}>Nova Prescrição</Text>
          </TouchableOpacity>
        )}
        {selectedSenior && (
          <Text style={styles.seniorLabel}>Visualizando dados de: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
        )}
        {loading ? (
          <Text style={styles.emptyText}>Carregando prescrições...</Text>
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : prescriptions.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma prescrição registrada para este idoso.</Text>
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
              <Text style={styles.dosage}>{formatDateTime(med.start_date)} até {formatDateTime(med.end_date)}</Text>
              {med.description ? (
                <Text style={styles.dosage}>{med.description}</Text>
              ) : null}
              {user?.role === 'doctor' && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity style={[styles.editButton, { flex: 1, marginRight: 8, marginBottom: 0, paddingVertical: 8 }]} onPress={() => openEditModal(med)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.editButton, { flex: 1, backgroundColor: '#e74c3c', marginBottom: 0, paddingVertical: 8 }]} onPress={() => handleDelete(med)}>
                    <Text style={styles.editButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
      {/* Modal de criação/edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 20, width: '90%', maxWidth: 400 }}>
            <Text style={styles.sectionTitle}>{editingPrescription ? 'Editar Prescrição' : 'Nova Prescrição'}</Text>
            {medicationsLoading ? (
              <Text style={{ color: '#888', marginBottom: 8 }}>Carregando medicamentos...</Text>
            ) : medicationsError ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>{medicationsError}</Text>
            ) : (
              <View style={{ backgroundColor: '#e6ecfa', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
                <Picker
                  selectedValue={form.medication_id}
                  onValueChange={v => handleFormChange('medication_id', v)}
                  enabled={!loading}
                  style={{ width: '100%', color: '#222', fontFamily: 'Montserrat-Regular', fontSize: 15, backgroundColor: 'transparent' }}
                  dropdownIconColor="#2bb3c0"
                >
                  <Picker.Item label="Selecione o medicamento" value="" color="#888" />
                  {medications.map((med: any) => (
                    <Picker.Item key={med.id} label={med.name} value={med.id} color="#222" />
                  ))}
                </Picker>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Dosagem"
              value={form.dosage}
              onChangeText={v => handleFormChange('dosage', v)}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Frequência (em horas)"
              value={form.frequency}
              onChangeText={v => handleFormChange('frequency', v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Início (dd/mm/yyyy HH:mm)"
              value={form.start_date}
              onChangeText={v => handleFormChange('start_date', v)}
              editable={!loading}
              keyboardType="numbers-and-punctuation"
            />
            {showStartDate && (
              <DateTimePicker
                value={form.start_date ? new Date(form.start_date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event: any, date?: Date) => {
                  setShowStartDate(false);
                  if (date) handleFormChange('start_date', date.toISOString());
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Data de Término (dd/mm/yyyy HH:mm)"
              value={form.end_date}
              onChangeText={v => handleFormChange('end_date', v)}
              editable={!loading}
              keyboardType="numbers-and-punctuation"
            />
            {showEndDate && (
              <DateTimePicker
                value={form.end_date ? new Date(form.end_date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event: any, date?: Date) => {
                  setShowEndDate(false);
                  if (date) handleFormChange('end_date', date.toISOString());
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Descrição (opcional)"
              value={form.description}
              onChangeText={v => handleFormChange('description', v)}
              editable={!loading}
            />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={[styles.editButton, { flex: 1, marginRight: 8, marginBottom: 0, paddingVertical: 10 }]} onPress={handleSave} disabled={loading || medicationsLoading}>
                <Text style={styles.editButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editButton, { flex: 1, backgroundColor: '#e6ecfa', marginBottom: 0, paddingVertical: 10 }]} onPress={() => setModalVisible(false)} disabled={loading}>
                <Text style={[styles.editButtonText, { color: '#2bb3c0' }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
});