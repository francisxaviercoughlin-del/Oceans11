import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>ST. LOUIS COUNTRY CLUB</Text>

      <View style={styles.hero}>
        <Text>Clubhouse Image Placeholder</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>NEW ROUND</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.secondaryButtonText}>COURSES</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  logo: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginVertical: 24 },
  hero: { height: 280, backgroundColor: Colors.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  secondaryButton: { borderWidth: 2, borderColor: Colors.primary, paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  primaryButtonText: { color: Colors.white, fontWeight: '700' },
  secondaryButtonText: { color: Colors.primary, fontWeight: '700' },
});
