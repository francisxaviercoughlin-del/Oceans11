import React, {
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ParStepper from '../components/ParStepper';
import type {
  CourseHoleDraft,
  Par,
} from '../models/Course';
import {
  courseFromDraft,
  CourseValidationError,
} from '../models/courseValidation';
import { useCourseRepository } from '../repositories/CourseRepositoryProvider';

type CreateCourseScreenProps = {
  navigation: {
    goBack(): void;
  };
};

const initialHoles: CourseHoleDraft[] =
  Array.from(
    { length: 18 },
    (_, index) => ({
      holeNumber: index + 1,
      par: 4,
      strokeIndex: '',
    }),
  );

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof CourseValidationError) {
    return error.message;
  }

  return 'The course could not be saved. Please try again.';
}

export default function CreateCourseScreen({
  navigation,
}: CreateCourseScreenProps) {
  const courseRepository =
    useCourseRepository();

  const [name, setName] = useState('');

  const [holes, setHoles] =
    useState<CourseHoleDraft[]>(initialHoles);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const isValid = useMemo(() => {
    try {
      courseFromDraft(name, holes);
      return true;
    } catch {
      return false;
    }
  }, [holes, name]);

  const updatePar = (
    index: number,
    par: number,
  ) => {
    if (
      par !== 3 &&
      par !== 4 &&
      par !== 5
    ) {
      return;
    }

    setHoles((currentHoles) =>
      currentHoles.map(
        (hole, holeIndex) =>
          holeIndex === index
            ? {
                ...hole,
                par: par as Par,
              }
            : hole,
      ),
    );
  };

  const updateStrokeIndex = (
    index: number,
    strokeIndex: string,
  ) => {
    const numericInput = strokeIndex
      .replace(/[^0-9]/g, '')
      .slice(0, 2);

    setHoles((currentHoles) =>
      currentHoles.map(
        (hole, holeIndex) =>
          holeIndex === index
            ? {
                ...hole,
                strokeIndex: numericInput,
              }
            : hole,
      ),
    );
  };

  const saveCourse = async () => {
    setErrorMessage(null);

    try {
      const course = courseFromDraft(
        name,
        holes,
      );

      setIsSaving(true);

      await courseRepository.save(course);

      navigation.goBack();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderRange = (
    start: number,
    end: number,
  ) =>
    holes
      .slice(start, end)
      .map((hole, rangeIndex) => {
        const holeIndex =
          start + rangeIndex;

        return (
          <View
            key={hole.holeNumber}
            style={styles.holeRow}
          >
            <Text style={styles.holeLabel}>
              Hole {hole.holeNumber}
            </Text>

            <ParStepper
              value={hole.par}
              onChange={(par: number) =>
                updatePar(holeIndex, par)
              }
            />

            <TextInput
              accessibilityLabel={
                `Stroke index for hole ${hole.holeNumber}`
              }
              value={hole.strokeIndex}
              onChangeText={(value) =>
                updateStrokeIndex(
                  holeIndex,
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={2}
              placeholder="SI"
              returnKeyType="done"
              style={
                styles.strokeIndexInput
              }
            />
          </View>
        );
      });

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        Create Course
      </Text>

      <TextInput
        accessibilityLabel="Course name"
        autoCapitalize="words"
        placeholder="Course Name"
        value={name}
        onChangeText={setName}
        style={styles.nameInput}
      />

      <Text style={styles.sectionTitle}>
        Front 9
      </Text>

      {renderRange(0, 9)}

      <Text
        style={[
          styles.sectionTitle,
          styles.backNineTitle,
        ]}
      >
        Back 9
      </Text>

      {renderRange(9, 18)}

      {errorMessage ? (
        <Text
          accessibilityRole="alert"
          style={styles.errorText}
        >
          {errorMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        accessibilityRole="button"
        disabled={!isValid || isSaving}
        onPress={() => void saveCourse()}
        style={[
          styles.saveButton,
          (!isValid || isSaving) &&
            styles.saveButtonDisabled,
        ]}
      >
        {isSaving ? (
          <ActivityIndicator
            color="#FFFFFF"
          />
        ) : (
          <Text
            style={styles.saveButtonText}
          >
            SAVE COURSE
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EF',
  },
  title: {
    color: '#2F2F2F',
    fontSize: 28,
    fontWeight: '700',
  },
  nameInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#B9AFA3',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    color: '#2F2F2F',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#8B3A3A',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  backNineTitle: {
    marginTop: 20,
  },
  holeRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  holeLabel: {
    width: 60,
    color: '#2F2F2F',
    fontSize: 16,
  },
  strokeIndexInput: {
    width: 52,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#B9AFA3',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    color: '#2F2F2F',
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: '#A12622',
    fontSize: 14,
    marginTop: 12,
  },
  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#8B3A3A',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9C9690',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
