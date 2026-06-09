import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>
        ST. LOUIS COUNTRY CLUB
      </Text>

      <View style={styles.hero}>
        <Text>Clubhouse Image Placeholder</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>
          NEW ROUND
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.secondaryButtonText}>
          COURSES
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EF',
    padding: 24,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 24,
  },
  hero: {
    height: 280,
    backgroundColor: '#D8D0C5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#8B3A3A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#8B3A3A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#8B3A3A',
    fontWeight: '700',
  },
});

