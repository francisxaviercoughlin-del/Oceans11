import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import DatabaseProvider from './src/database/DatabaseProvider';
import { CourseRepositoryProvider } from './src/repositories/CourseRepositoryProvider';

export default function App() {
  return (
    <DatabaseProvider>
      <CourseRepositoryProvider>
        <AppNavigator />
      </CourseRepositoryProvider>
    </DatabaseProvider>
  );
}
