import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../api/auth';
import { API_BASE_URL } from '../../constants/api';
import { useSenior } from '../../context/SeniorContext';

const initialSlots = Array.from({ length: 14 }, (_, i) => ({ id: i + 1, name: '', quantity: 0 }));
const CIRCLE_SIZE = 340;
const CENTER = CIRCLE_SIZE / 2;
const RADIUS = CIRCLE_SIZE / 2 - 10;
const SLOT_COUNT = initialSlots.length;

export default function DispenserScreen() {
  const { selectedSenior } = useSenior();
  const [slots, setSlots] = useState<any[]>(initialSlots);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medications, setMedications] = useState<any[]>([]);
  const [medicationsLoading, setMedicationsLoading] = useState(false);
  const [medicationsError, setMedicationsError] = useState('');
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>('');
  const isFocused = useIsFocused();

  // Busca dados reais do dispenser ao abrir a tela ou ao focar a aba
  useEffect(() => {
    const fetchDispenser = async () => {
      if (!selectedSenior) return;
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await axios.get(`${API_BASE_URL}/device/by_senior/${selectedSenior.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const compartments = res.data?.dispenser?.compartments || [];
        // Preenche os 14 slots, mantendo a ordem, preenchendo vazios se necessário
        const filledSlots = Array.from({ length: 14 }, (_, i) => {
          const comp = compartments[i];
          return comp
            ? {
                id: i + 1,
                compartment_id: comp.compartment_id,
                medication_id: comp.medication_id || '',
                medication_name: comp.medication_name || '',
                quantity: comp.quantity || 0,
              }
            : { id: i + 1, compartment_id: '', medication_id: '', medication_name: '', quantity: 0 };
        });
        setSlots(filledSlots);
      } catch (e) {
        setError('Erro ao carregar dados do dispenser.');
      } finally {
        setLoading(false);
      }
    };
    fetchDispenser();
  }, [selectedSenior, isFocused]);

  // Carrega medicamentos ao abrir o card de edição
  useEffect(() => {
    if (!editingSlot) return;
    setMedicationsLoading(true);
    setMedicationsError('');
    (async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_BASE_URL}/medications/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedications(res.data);
        // Se já existe um medicamento selecionado no slot, seleciona ele
        const slot = slots.find(s => s.id === editingSlot);
        if (slot && slot.medication_id) {
          setSelectedMedicationId(slot.medication_id);
        } else {
          setSelectedMedicationId('');
        }
      } catch (e) {
        setMedicationsError('Erro ao carregar medicamentos.');
      } finally {
        setMedicationsLoading(false);
      }
    })();
  }, [editingSlot]);

  function handleEdit(slot: any) {
    setEditingSlot(slot.id);
    setNewName(slot.medication_name);
    setNewQty(slot.quantity ? String(slot.quantity) : '');
  }

  async function handleSave(slotId: number) {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.compartment_id) {
      alert('Compartimento inválido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      // Se não houver medicamento selecionado, limpa o slot (medication_id: null, quantity: 0)
      if (!selectedMedicationId) {
        await axios.put(
          `${API_BASE_URL}/compartment/${slot.compartment_id}`,
          { medication_id: "", quantity: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlots(slots.map(s =>
          s.id === slotId
            ? { ...s, medication_id: '', medication_name: '', quantity: 0 }
            : s
        ));
      } else {
        await axios.put(
          `${API_BASE_URL}/compartment/${slot.compartment_id}`,
          { medication_id: selectedMedicationId, quantity: Number(newQty) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Busca o nome do medicamento selecionado
        const med = medications.find((m: any) => m.id === selectedMedicationId);
        setSlots(slots.map(s =>
          s.id === slotId
            ? { ...s, medication_id: selectedMedicationId, medication_name: med ? med.name : '', quantity: Number(newQty) }
            : s
        ));
      }
      setEditingSlot(null);
      setNewName('');
      setNewQty('');
      setSelectedMedicationId('');
    } catch (e) {
      alert('Erro ao salvar compartimento.');
    } finally {
      setLoading(false);
    }
  }

  // Calcula a posição de cada slot (sem rotação do conteúdo, apenas posição circular)
  function getSlotStyle(idx: number) {
    const angle = (2 * Math.PI / SLOT_COUNT) * idx - Math.PI / 2;
    const x = CENTER + Math.cos(angle) * (RADIUS - 20) - 25;
    const y = CENTER + Math.sin(angle) * (RADIUS - 20) - 25;
    return {
      position: 'absolute' as const,
      left: x,
      top: y,
      width: 50,
      height: 50,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Dispenser Management</Text>
        <Text style={styles.sectionDesc}>Tap a slot in the circle to edit its medication.</Text>
        {selectedSenior && (
          <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
        )}
        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
        {loading ? (
          <Text style={{ color: '#888', marginBottom: 10 }}>Carregando...</Text>
        ) : null}
        <View style={styles.circleContainer}>
          <View style={styles.circleBg}>
            {slots.map((slot, idx) => (
              <TouchableOpacity
                key={slot.id}
                style={getSlotStyle(idx)}
                onPress={() => handleEdit(slot)}
                activeOpacity={0.7}
                disabled={loading}
              >
                <View style={[styles.slotFat, {
                  backgroundColor: slot.medication_name ? (editingSlot === slot.id ? '#1e8a9e' : '#2bb3c0') : '#e6ecfa',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }] }>
                  <FontAwesome5 name="capsules" size={14} color={slot.medication_name ? '#fff' : '#b0c4d4'} />
                  <Text style={[styles.fatText, { fontSize: 9 }]} numberOfLines={1}>{slot.medication_name || slot.id}</Text>
                  <Text style={[styles.fatQty, { fontSize: 9 }]}>{slot.quantity}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.circleCenter} />
          </View>
        </View>
        {editingSlot && (
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Slot</Text>
            {medicationsLoading ? (
              <Text style={{ color: '#888', marginBottom: 8 }}>Carregando medicamentos...</Text>
            ) : medicationsError ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>{medicationsError}</Text>
            ) : (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedMedicationId}
                  onValueChange={setSelectedMedicationId}
                  enabled={!loading}
                  style={styles.picker}
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
              placeholder="Quantity"
              value={newQty}
              onChangeText={setNewQty}
              keyboardType="numeric"
              editable={!loading}
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(editingSlot)} disabled={loading || medicationsLoading}>
              <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingSlot(null)} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2bb3c0',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 9,
    fontFamily: 'Montserrat-Regular',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  circleBg: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#e6ecfa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotFat: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    padding: 4,
  },
  fatText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginTop: 2,
  },
  fatQty: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
  },
  circleCenter: {
    position: 'absolute',
    left: CIRCLE_SIZE / 2 - 22,
    top: CIRCLE_SIZE / 2 - 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2bb3c0',
  },
  editCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  editTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2bb3c0',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  input: {
    backgroundColor: '#e6ecfa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2bb3c0',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  },
  cancelButton: {
    backgroundColor: '#e6ecfa',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: '#2bb3c0',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
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
  pickerWrapper: {
    backgroundColor: '#e6ecfa',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  picker: {
    width: '100%',
    color: '#222',
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0,
  },
});
