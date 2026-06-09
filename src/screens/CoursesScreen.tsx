import React, {
  useCallback,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CourseSummary } from '../models/Course';
import { useCourseRepository } from '../repositories/CourseRepositoryProvider';

type CoursesScreenProps = {
  navigation: {
    navigate(route: 'CreateCourse'): void;
  };
};

export default function CoursesScreen({
  navigation,
}: CoursesScreenProps) {
  const courseRepository = useCourseRepository();

  const [courses, setCourses] =
    useState<CourseSummary[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setErrorMessage(null);

    try {
      setIsLoading(true);

      const savedCourses =
        await courseRepository.getAll();

      setCourses(savedCourses);
    } catch {
      setErrorMessage(
        'Courses could not be loaded. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseRepository]);

  useFocusEffect(
    useCallback(() => {
      void loadCourses();
    }, [loadCourses]),
  );

  const deleteCourse = async (
    course: CourseSummary,
  ) => {
    try {
      await courseRepository.delete(course.id);
      await loadCourses();
    } catch {
      Alert.alert(
        'Unable to delete course',
        'Please try again.',
      );
    }
  };

  const confirmDelete = (
    course: CourseSummary,
  ) => {
    Alert.alert(
      'Delete course?',
      `${course.name} will be permanently removed.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            void deleteCourse(course),
        },
      ],
    );
  };

  const renderCourse = ({
    item,
  }: {
    item: CourseSummary;
  }) => (
    <View style={styles.courseRow}>
      <View style={styles.courseDetails}>
        <Text style={styles.courseName}>
          {item.name}
        </Text>

        <Text style={styles.courseMeta}>
          18 holes · Par {item.totalPar}
        </Text>
      </View>

      <TouchableOpacity
        accessibilityLabel={`Delete ${item.name}`}
        accessibilityRole="button"
        onPress={() => confirmDelete(item)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>
          DELETE
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Courses</Text>

      {isLoading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            color="#8B3A3A"
            size="large"
          />

          <Text style={styles.stateText}>
            Loading courses…
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.stateContainer}>
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
          >
            {errorMessage}
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => void loadCourses()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>
              TRY AGAIN
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={
            courses.length === 0
              ? styles.emptyList
              : styles.list
          }
          data={courses}
          keyExtractor={(course) => course.id}
          renderItem={renderCourse}
          ListEmptyComponent={
            <View style={styles.stateContainer}>
              <Text style={styles.emptyTitle}>
                No courses yet
              </Text>

              <Text style={styles.stateText}>
                Create a course to start setting
                up rounds.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('CreateCourse')
        }
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>
          CREATE COURSE
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F5EF',
  },
  title: {
    color: '#2F2F2F',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  courseRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: '#CFC6BB',
    paddingVertical: 12,
  },
  courseDetails: {
    flex: 1,
    paddingRight: 12,
  },
  courseName: {
    color: '#2F2F2F',
    fontSize: 17,
    fontWeight: '600',
  },
  courseMeta: {
    color: '#6F6861',
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: '#8B3A3A',
    fontSize: 12,
    fontWeight: '700',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  stateText: {
    color: '#6F6861',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#2F2F2F',
    fontSize: 20,
    fontWeight: '600',
  },
  errorText: {
    color: '#A12622',
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8B3A3A',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: '#8B3A3A',
    fontWeight: '700',
  },
  createButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#8B3A3A',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
