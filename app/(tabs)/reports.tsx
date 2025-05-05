import { Button, StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.text}>- Relatório de medicamentos: Disponível</Text>
      <Text style={styles.text}>- Relatório de sintomas: Disponível</Text>
      <Button title="Exportar Relatório" onPress={() => alert('Relatório exportado!')} />
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