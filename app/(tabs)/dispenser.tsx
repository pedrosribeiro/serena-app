import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSenior } from '../../context/SeniorContext';

const initialSlots = Array.from({ length: 14 }, (_, i) => ({ id: i + 1, name: '', quantity: 0 }));
const CIRCLE_SIZE = 340;
const CENTER = CIRCLE_SIZE / 2;
const RADIUS = CIRCLE_SIZE / 2 - 10;
const SLOT_COUNT = initialSlots.length;

export default function DispenserScreen() {
  const [slots, setSlots] = useState(initialSlots);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const { selectedSenior } = useSenior();

  function handleEdit(slot: typeof initialSlots[0]) {
    setEditingSlot(slot.id);
    setNewName(slot.name);
    setNewQty(slot.quantity ? String(slot.quantity) : '');
  }

  function handleSave(slotId: number) {
    setSlots(slots.map(s => s.id === slotId ? { ...s, name: newName, quantity: Number(newQty) } : s));
    setEditingSlot(null);
    setNewName('');
    setNewQty('');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Dispenser Management</Text>
      <Text style={styles.sectionDesc}>Tap a slot in the circle to edit its medication.</Text>
      {selectedSenior && (
        <Text style={styles.seniorLabel}>Viewing data for: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
      )}
      <View style={styles.circleContainer}>
        <View style={styles.circleBg}>
          {slots.map((slot, idx) => (
            <TouchableOpacity
              key={slot.id}
              style={getSlotStyle(idx)}
              onPress={() => handleEdit(slot)}
              activeOpacity={0.7}
            >
              <View style={[styles.slotFat, {
                backgroundColor: slot.name ? (editingSlot === slot.id ? '#1e8a9e' : '#2bb3c0') : '#e6ecfa',
                width: 50,
                height: 50,
                borderRadius: 25,
              }] }>
                <FontAwesome5 name="capsules" size={14} color={slot.name ? '#fff' : '#b0c4d4'} />
                <Text style={[styles.fatText, { fontSize: 9 }]} numberOfLines={1}>{slot.name || slot.id}</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Medication name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newQty}
            onChangeText={setNewQty}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(editingSlot)}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingSlot(null)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
});
