import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

export default function CoursesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Courses</Text>

      <TouchableOpacity style={styles.courseRow}><Text>Bellerive Country Club</Text></TouchableOpacity>
      <TouchableOpacity style={styles.courseRow}><Text>St. Louis Country Club</Text></TouchableOpacity>
      <TouchableOpacity style={styles.courseRow}><Text>Old Warson Country Club</Text></TouchableOpacity>

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>CREATE COURSE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  courseRow: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 8, marginBottom: 12 },
  createButton: { marginTop: 24, backgroundColor: Colors.primary, padding: 16, borderRadius: 10, alignItems: 'center' },
  createButtonText: { color: '#FFFFFF', fontWeight: '700' },
});
