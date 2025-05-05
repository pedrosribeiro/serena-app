import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumo Diário</Text>
      <Text style={styles.text}>- Medicamentos tomados: 3/5</Text>
      <Text style={styles.text}>- Sintomas relatados: Nenhum</Text>
      <View style={styles.cardsRow}>
        <Card style={styles.card} onPress={() => navigation.navigate('Prescriptions')}>
          <Card.Content style={styles.cardContent}>
            <FontAwesome5 name="pills" size={36} color="#2bb3c0" />
            <Text style={styles.cardTitle}>Medicines</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Symptoms')}>
          <Card.Content style={styles.cardContent}>
            <MaterialIcons name="sick" size={36} color="#4ecb71" />
            <Text style={styles.cardTitle}>Symptoms</Text>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.cardsRow}>
        <Card style={styles.card} onPress={() => navigation.navigate('Reports')}>
          <Card.Content style={styles.cardContent}>
            <Ionicons name="document-text-outline" size={36} color="#2bb3c0" />
            <Text style={styles.cardTitle}>Reports</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Settings')}>
          <Card.Content style={styles.cardContent}>
            <Ionicons name="settings-outline" size={36} color="#4ecb71" />
            <Text style={styles.cardTitle}>Settings</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f8fcff',
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
  },
  text: {
    fontSize: 18,
    color: '#444',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  card: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 18,
    elevation: 2,
    backgroundColor: '#fff',
    minWidth: 140,
    maxWidth: 180,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardTitle: {
    fontSize: 18,
    marginTop: 12,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
});
