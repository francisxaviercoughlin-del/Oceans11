
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CreateCourseScreen from '../screens/CreateCourseScreen';

const Stack=createNativeStackNavigator();

export default function AppNavigator(){
 return(
  <NavigationContainer>
   <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen}/>
    <Stack.Screen name="Courses" component={CoursesScreen}/>
    <Stack.Screen name="CreateCourse" component={CreateCourseScreen}/>
   </Stack.Navigator>
  </NavigationContainer>
 );
}
