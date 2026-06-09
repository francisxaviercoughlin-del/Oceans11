import React, {
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SQLiteProvider,
  type SQLiteDatabase,
} from 'expo-sqlite';
import { migrateDatabase } from './migrations';
import { DATABASE_NAME } from './schema';

function DatabaseLoadingScreen() {
  return (
    <View style={styles.stateContainer}>
      <ActivityIndicator
        color="#8B3A3A"
        size="large"
      />
      <Text style={styles.message}>
        Preparing your courses…
      </Text>
    </View>
  );
}

function DatabaseErrorScreen({
  error,
  onRetry,
}: {
  error: Error;
  onRetry(): void;
}) {
  const webHelp =
    Platform.OS === 'web'
      ? ' Restart Expo after adding the SQLite web configuration, then reload this page.'
      : '';

  return (
    <View style={styles.stateContainer}>
      <Text
        accessibilityRole="header"
        style={styles.errorTitle}
      >
        Course storage could not start
      </Text>

      <Text
        accessibilityRole="alert"
        style={styles.message}
      >
        The local course database could not be opened.
        {webHelp}
      </Text>

      {__DEV__ ? (
        <Text style={styles.debugMessage}>
          {error.message}
        </Text>
      ) : null}

      <TouchableOpacity
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.retryButton}
      >
        <Text style={styles.retryButtonText}>
          TRY AGAIN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DatabaseProvider({
  children,
}: PropsWithChildren) {
  const [providerKey, setProviderKey] = useState(0);
  const [isInitializing, setIsInitializing] =
    useState(true);
  const [
    initializationError,
    setInitializationError,
  ] = useState<Error | null>(null);

  const initializeDatabase = useCallback(
    async (database: SQLiteDatabase) => {
      await migrateDatabase(database);
      setIsInitializing(false);
    },
    [],
  );

  const handleError = useCallback((error: Error) => {
    console.error(
      'SQLite initialization failed.',
      error,
    );
    setInitializationError(error);
  }, []);

  const retry = useCallback(() => {
    setInitializationError(null);
    setIsInitializing(true);
    setProviderKey(
      (currentKey) => currentKey + 1,
    );
  }, []);

  if (initializationError) {
    return (
      <DatabaseErrorScreen
        error={initializationError}
        onRetry={retry}
      />
    );
  }

  return (
    <SQLiteProvider
      key={providerKey}
      databaseName={DATABASE_NAME}
      onError={handleError}
      onInit={initializeDatabase}
    >
      {isInitializing ? (
        <DatabaseLoadingScreen />
      ) : (
        children
      )}
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EF',
  },
  appContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#F8F5EF',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8F5EF',
    padding: 24,
  },
  message: {
    maxWidth: 420,
    color: '#2F2F2F',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#8B3A3A',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  debugMessage: {
    maxWidth: 420,
    color: '#6F6861',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#8B3A3A',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
