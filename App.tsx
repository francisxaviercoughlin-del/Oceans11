import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>ST. LOUIS COUNTRY CLUB</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroText}>Clubhouse Image Placeholder</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>NEW ROUND</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>COURSES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EF',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F2F2F',
  },
  hero: {
    height: 280,
    backgroundColor: '#D8D0C5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  heroText: {
    color: '#555',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#8B3A3A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#8B3A3A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#8B3A3A',
    fontWeight: '700',
    fontSize: 16,
  },
});
