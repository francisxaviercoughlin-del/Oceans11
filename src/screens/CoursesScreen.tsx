
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function CoursesScreen({navigation}:any){
  return (
    <SafeAreaView style={{padding:20}}>
      <Text style={{fontSize:28,fontWeight:'700'}}>Courses</Text>
      <TouchableOpacity
        onPress={()=>navigation.navigate('CreateCourse')}
        style={{marginTop:20,padding:16,backgroundColor:'#8B3A3A'}}
      >
        <Text style={{color:'white'}}>CREATE COURSE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
