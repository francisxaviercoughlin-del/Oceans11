import React, {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { CourseRepository } from './CourseRepository';
import { SqliteCourseRepository } from './SqliteCourseRepository';

const CourseRepositoryContext =
  createContext<CourseRepository | null>(null);

export function CourseRepositoryProvider({
  children,
}: PropsWithChildren) {
  const database = useSQLiteContext();

  const repository = useMemo(
    () => new SqliteCourseRepository(database),
    [database],
  );

  return (
    <CourseRepositoryContext.Provider
      value={repository}
    >
      {children}
    </CourseRepositoryContext.Provider>
  );
}

export function useCourseRepository(): CourseRepository {
  const repository = useContext(
    CourseRepositoryContext,
  );

  if (!repository) {
    throw new Error(
      'useCourseRepository must be used within CourseRepositoryProvider.',
    );
  }

  return repository;
}
