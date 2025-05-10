import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header com avatar e saudação */}
      <View style={styles.headerRow}>
        <View style={styles.avatarCircle}>
          <Image source={require('../../assets/images/icon.png')} style={styles.avatarImg} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'} 👋</Text>
        </View>
        {/* Removido menu sanduíche */}
      </View>

      {/* Cards de Atalhos */}
      <View style={styles.cardsRow}>
        <View style={styles.metricCard}>
          <MaterialIcons name="medical-services" size={32} color="#2bb3c0" />
          <Text style={styles.cardTitle}>Consultas</Text>
          <Text style={styles.cardSub}>6 médicos</Text>
        </View>
        <View style={styles.metricCard}>
          <FontAwesome5 name="pills" size={32} color="#4ecb71" />
          <Text style={styles.cardTitle}>Farmácia</Text>
          <Text style={styles.cardSub}>4 farmácias</Text>
        </View>
      </View>

      {/* Métricas de Saúde */}
      <Text style={styles.sectionTitle}>Minha Saúde</Text>
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Ionicons name="heart" size={28} color="#e74c3c" />
          <Text style={styles.metricValue}>78</Text>
          <Text style={styles.metricLabel}>bpm</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="moon" size={28} color="#2bb3c0" />
          <Text style={styles.metricValue}>8</Text>
          <Text style={styles.metricLabel}>hrs sono</Text>
        </View>
      </View>

      {/* Atalhos para outras telas */}
      <View style={styles.cardsRow}>
        <View style={styles.metricCard}>
          <Ionicons name="document-text-outline" size={32} color="#2bb3c0" />
          <Text style={styles.cardTitle}>Relatórios</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="settings-outline" size={32} color="#4ecb71" />
          <Text style={styles.cardTitle}>Configurações</Text>
        </View>
      </View>
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 6,
    fontFamily: 'Montserrat-Bold',
  },
  metricLabel: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
});
