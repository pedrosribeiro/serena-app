import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SymptomsScreen() {
  const [symptom, setSymptom] = useState('');

  const handleReport = () => {
    alert(`Sintoma relatado: ${symptom}`);
    setSymptom('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatar Sintomas</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva como está se sentindo"
        value={symptom}
        onChangeText={setSymptom}
      />
      <Button title="Relatar" onPress={handleReport} />
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
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});