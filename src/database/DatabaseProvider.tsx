import React, { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDatabase } from './migrations';
import { DATABASE_NAME } from './schema';

export default function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={migrateDatabase}
    >
      {children}
    </SQLiteProvider>
  );
}
