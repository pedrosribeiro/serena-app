import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../api/auth';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';
import { useSenior } from '../../context/SeniorContext';

export default function ReportsScreen() {
  const { user } = useAuth();
  const { selectedSenior } = useSenior();
  const [senior, setSenior] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedSenior) return;
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/reports/report/${selectedSenior.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erro ao carregar relatório');
        const data = await res.json();
        setSenior(data);
      } catch (e) {
        setError('Erro ao carregar relatório. Tente novamente.');
        setSenior(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedSenior, isFocused]);

  async function handleExportPDF() {
    if (Platform.OS === 'web') {
      window.print();
      return;
    }
    if (!senior) return;
    try {
      const now = new Date();
      const dataHora = now.toLocaleString('pt-BR');
      const html = `
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
        h1 { color: #2bb3c0; font-size: 24px; margin-bottom: 12px; }
        h2 { color: #457B9D; font-size: 18px; margin-top: 24px; margin-bottom: 8px; }
        .section { margin-bottom: 18px; }
        .label { font-weight: bold; }
        .footer { margin-top: 32px; font-size: 12px; color: #888; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Relatório do Idoso</h1>
          <div class="section">
        <h2>Informações Pessoais</h2>
        <div><span class="label">Nome:</span> ${senior.name}</div>
        <div><span class="label">Idade:</span> ${senior.age}</div>
        <div><span class="label">Identificador:</span> ${senior.identifier}</div>
          </div>
          <div class="section">
        <h2>Médicos</h2>
        ${senior.doctors && Array.isArray(senior.doctors) && senior.doctors.length > 0
          ? senior.doctors.map((doc: any) => `<div>${doc.name} (${doc.specialty})</div>`).join('')
          : '<div>Nenhum médico cadastrado.</div>'}
          </div>
          <div class="section">
        <h2>Tratamento Atual</h2>
        ${senior.prescriptions && Array.isArray(senior.prescriptions) && senior.prescriptions.length > 0
          ? senior.prescriptions.map((med: any) => `<div>${med.name} ${med.dosage || ''} - a cada ${med.frequency}h</div>`).join('')
          : '<div>Nenhum tratamento cadastrado.</div>'}
          </div>
          <div class="section">
        <h2>Sintomas Reportados</h2>
        ${senior.symptoms && Array.isArray(senior.symptoms) && senior.symptoms.length > 0
          ? senior.symptoms.map((s: any) => `<div>${s.name} - ${s.severity} (${s.date} às ${s.time})</div>`).join('')
          : '<div>Nenhum sintoma reportado.</div>'}
          </div>
          <div class="section">
        <h2>Histórico de Medicação</h2>
        ${senior.medicationHistory && Array.isArray(senior.medicationHistory) && senior.medicationHistory.length > 0
          ? senior.medicationHistory.map((m: any) => `<div>${m.name} - ${m.date} às ${m.time}: ${m.taken ? 'Tomado' : 'Perdido'}</div>`).join('')
          : '<div>Nenhum histórico de medicação disponível.</div>'}
          </div>
          <div class="footer">Exportado em: ${dataHora}</div>
        </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri);
    } catch (e) {
      alert('Erro ao exportar PDF. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fcff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Relatório do Idoso</Text>
        {selectedSenior && (
          <Text style={styles.seniorLabel}>Visualizando dados de: <Text style={styles.seniorName}>{selectedSenior.name}</Text></Text>
        )}
        {loading ? (
          <Text style={styles.infoText}>Carregando relatório...</Text>
        ) : error ? (
          <Text style={styles.infoText}>{error}</Text>
        ) : senior ? (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Informações Pessoais</Text>
              <Text style={styles.infoText}>Nome: {senior.name}</Text>
              <Text style={styles.infoText}>Idade: {senior.age}</Text>
              <Text style={styles.infoText}>Identificador: {senior.identifier}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Médicos</Text>
              {senior.doctors && Array.isArray(senior.doctors) && senior.doctors.length === 0 ? (
                <Text style={styles.infoText}>Nenhum médico cadastrado.</Text>
              ) : null}
              {senior.doctors && Array.isArray(senior.doctors) && senior.doctors.length > 0 && senior.doctors.map((doc: any, i: number) => (
                <Text key={i} style={styles.infoText}>{doc.name} ({doc.specialty})</Text>
              ))}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Tratamento Atual</Text>
              {senior.prescriptions && Array.isArray(senior.prescriptions) && senior.prescriptions.length === 0 ? (
                <Text style={styles.infoText}>Nenhum tratamento cadastrado.</Text>
              ) : null}
              {senior.prescriptions && Array.isArray(senior.prescriptions) && senior.prescriptions.length > 0 && senior.prescriptions.map((med: any, i: number) => (
                <Text key={i} style={styles.infoText}>{med.name} {med.dosage} - a cada {med.frequency}h</Text>
              ))}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Sintomas Reportados</Text>
              {senior.symptoms && Array.isArray(senior.symptoms) && senior.symptoms.length === 0 ? (
                <Text style={styles.infoText}>Nenhum sintoma reportado.</Text>
              ) : null}
              {senior.symptoms && Array.isArray(senior.symptoms) && senior.symptoms.length > 0 && senior.symptoms.map((s: any, i: number) => (
                <Text key={i} style={styles.infoText}>{s.name} - {s.severity} ({s.date} às {s.time})</Text>
              ))}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Histórico de Medicação</Text>
              {senior.medicationHistory && Array.isArray(senior.medicationHistory) && senior.medicationHistory.length === 0 ? (
                <Text style={styles.infoText}>Nenhum histórico de medicação disponível.</Text>
              ) : null}
              {senior.medicationHistory && Array.isArray(senior.medicationHistory) && senior.medicationHistory.length > 0 && senior.medicationHistory.map((m: any, i: number) => (
                <Text key={i} style={styles.infoText}>
                  {m.name} - {m.date} às {m.time}: {m.taken ? 'Tomado' : 'Perdido'}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportPDF}
            >
              <FontAwesome5 name="file-export" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.exportButtonText}>Exportar como PDF</Text>
            </TouchableOpacity>
          </>
        ) : null}
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#457B9D',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  infoText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 2,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 4,
  },
});