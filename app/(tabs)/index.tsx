import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { selectedSenior } = useSenior();
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with avatar and greeting */}
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Image source={require('../../assets/images/user.png')} style={styles.avatarImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Olá,</Text>
            <Text style={styles.username}>{user?.name || 'Usuário'} 👋</Text>
            {selectedSenior && (
              <Text style={styles.seniorLabel}>Gerenciando: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
            )}
          </View>
        </View>

        {/* Atalhos Rápidos */}
        {user?.role !== 'doctor' && (
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('Dispenser')}>
              <MaterialIcons name="medication" size={32} color="#4ecb71" />
              <Text style={styles.cardTitle}>Dispenser</Text>
              <Text style={styles.cardSub}>Gerenciar medicamentos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Atalhos Principais */}
        <Text style={styles.sectionTitle}>Atalhos</Text>
        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('Prescriptions')}>
            <FontAwesome5 name="pills" size={32} color="#2bb3c0" />
            <Text style={styles.cardTitle}>Receitas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('Symptoms')}>
            <MaterialIcons name="sick" size={32} color="#e74c3c" />
            <Text style={styles.cardTitle}>Sintomas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('Reports')}>
            <Ionicons name="document-text-outline" size={32} color="#2bb3c0" />
            <Text style={styles.cardTitle}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={32} color="#4ecb71" />
            <Text style={styles.cardTitle}>Configurações</Text>
          </TouchableOpacity>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e6ecfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  hello: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Montserrat-Bold',
  },
  seniorLabel: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  seniorName: {
    color: '#2bb3c0',
    fontFamily: 'Montserrat-Bold',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginTop: 10,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2bb3c0',
    marginTop: 18,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
});
