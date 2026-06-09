
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ParStepper({ value, onChange }: any) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onChange(Math.max(3, value - 1))}>
        <Text style={styles.btn}>-</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity onPress={() => onChange(Math.min(5, value + 1))}>
        <Text style={styles.btn}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',gap:12},
  btn:{fontSize:24,fontWeight:'700'},
  value:{fontSize:18,minWidth:20,textAlign:'center'}
});
