import type {
  CourseHole,
  CourseHoleDraft,
  NewCourse,
  Par,
} from './Course';

export class CourseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CourseValidationError';
  }
}

function isPar(value: number): value is Par {
  return value === 3 || value === 4 || value === 5;
}

function validateHoles(holes: readonly CourseHole[]): void {
  if (holes.length !== 18) {
    throw new CourseValidationError(
      'A course must contain exactly 18 holes.',
    );
  }

  const holeNumbers = holes.map((hole) => hole.holeNumber);
  const strokeIndexes = holes.map(
    (hole) => hole.strokeIndex,
  );

  const hasInvalidHoleNumber = holeNumbers.some(
    (holeNumber) =>
      !Number.isInteger(holeNumber) ||
      holeNumber < 1 ||
      holeNumber > 18,
  );

  if (
    hasInvalidHoleNumber ||
    new Set(holeNumbers).size !== 18
  ) {
    throw new CourseValidationError(
      'Hole numbers must be unique values from 1 through 18.',
    );
  }

  if (holes.some((hole) => !isPar(hole.par))) {
    throw new CourseValidationError(
      'Par must be 3, 4, or 5 for every hole.',
    );
  }

  const hasInvalidStrokeIndex = strokeIndexes.some(
    (strokeIndex) =>
      !Number.isInteger(strokeIndex) ||
      strokeIndex < 1 ||
      strokeIndex > 18,
  );

  if (
    hasInvalidStrokeIndex ||
    new Set(strokeIndexes).size !== 18
  ) {
    throw new CourseValidationError(
      'Stroke indexes must be unique values from 1 through 18.',
    );
  }
}

export function validateNewCourse(
  course: NewCourse,
): NewCourse {
  const name = course.name.trim();

  if (!name) {
    throw new CourseValidationError(
      'Enter a course name.',
    );
  }

  validateHoles(course.holes);

  return {
    name,
    holes: [...course.holes].sort(
      (left, right) =>
        left.holeNumber - right.holeNumber,
    ),
  };
}

export function courseFromDraft(
  name: string,
  holes: readonly CourseHoleDraft[],
): NewCourse {
  const parsedHoles = holes.map<CourseHole>((hole) => ({
    holeNumber: hole.holeNumber,
    par: hole.par,
    strokeIndex: Number(hole.strokeIndex),
  }));

  return validateNewCourse({
    name,
    holes: parsedHoles,
  });
}
