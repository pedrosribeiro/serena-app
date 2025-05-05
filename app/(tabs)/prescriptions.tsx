import { Button, StyleSheet, Text, View } from 'react-native';

export default function PrescriptionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescrições</Text>
      <Text style={styles.text}>- Paracetamol: 8h, 14h, 20h</Text>
      <Text style={styles.text}>- Aspirina: 10h, 22h</Text>
      <Button title="Marcar como tomado" onPress={() => alert('Medicamento marcado como tomado!')} />
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
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});