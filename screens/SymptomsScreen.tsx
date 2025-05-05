import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SymptomsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Symptoms Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FAEE',
  },
  text: {
    fontSize: 24,
    color: '#457B9D',
  },
});