import type {
  SQLiteDatabase,
  SQLiteStatement,
} from 'expo-sqlite';
import type {
  Course,
  CourseHole,
  CourseSummary,
  NewCourse,
  Par,
} from '../models/Course';
import { validateNewCourse } from '../models/courseValidation';
import type { CourseRepository } from './CourseRepository';

type CourseRow = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type CourseSummaryRow = CourseRow & {
  total_par: number;
};

type CourseHoleRow = {
  hole_number: number;
  par: number;
  stroke_index: number;
};

type GeneratedIdRow = {
  id: string;
};

export class SqliteCourseRepository
  implements CourseRepository
{
  constructor(
    private readonly database: SQLiteDatabase,
  ) {}

  async save(course: NewCourse): Promise<Course> {
    const validatedCourse =
      validateNewCourse(course);

    const idRow =
      await this.database.getFirstAsync<GeneratedIdRow>(
        'SELECT lower(hex(randomblob(16))) AS id;',
      );

    if (!idRow) {
      throw new Error(
        'Unable to generate a course identifier.',
      );
    }

    const now = new Date().toISOString();

    await this.database.withTransactionAsync(
      async () => {
        await this.database.runAsync(
          `
            INSERT INTO courses (
              id,
              name,
              created_at,
              updated_at
            )
            VALUES (
              $id,
              $name,
              $createdAt,
              $updatedAt
            );
          `,
          {
            $id: idRow.id,
            $name: validatedCourse.name,
            $createdAt: now,
            $updatedAt: now,
          },
        );

        let statement:
          | SQLiteStatement
          | undefined;

        try {
          statement =
            await this.database.prepareAsync(
              `
                INSERT INTO course_holes (
                  course_id,
                  hole_number,
                  par,
                  stroke_index
                )
                VALUES (
                  $courseId,
                  $holeNumber,
                  $par,
                  $strokeIndex
                );
              `,
            );

          for (
            const hole of validatedCourse.holes
          ) {
            await statement.executeAsync({
              $courseId: idRow.id,
              $holeNumber: hole.holeNumber,
              $par: hole.par,
              $strokeIndex: hole.strokeIndex,
            });
          }
        } finally {
          await statement?.finalizeAsync();
        }
      },
    );

    return {
      id: idRow.id,
      name: validatedCourse.name,
      holes: validatedCourse.holes,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getAll(): Promise<CourseSummary[]> {
    const rows =
      await this.database.getAllAsync<CourseSummaryRow>(
        `
          SELECT
            courses.id,
            courses.name,
            courses.created_at,
            courses.updated_at,
            COALESCE(
              SUM(course_holes.par),
              0
            ) AS total_par
          FROM courses
          LEFT JOIN course_holes
            ON course_holes.course_id =
              courses.id
          GROUP BY
            courses.id,
            courses.name,
            courses.created_at,
            courses.updated_at
          ORDER BY
            courses.name COLLATE NOCASE ASC,
            courses.created_at ASC;
        `,
      );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      totalPar: row.total_par,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getById(
    id: string,
  ): Promise<Course | null> {
    const courseRow =
      await this.database.getFirstAsync<CourseRow>(
        `
          SELECT
            id,
            name,
            created_at,
            updated_at
          FROM courses
          WHERE id = $id;
        `,
        {
          $id: id,
        },
      );

    if (!courseRow) {
      return null;
    }

    const holeRows =
      await this.database.getAllAsync<CourseHoleRow>(
        `
          SELECT
            hole_number,
            par,
            stroke_index
          FROM course_holes
          WHERE course_id = $courseId
          ORDER BY hole_number ASC;
        `,
        {
          $courseId: id,
        },
      );

    return {
      id: courseRow.id,
      name: courseRow.name,
      holes: holeRows.map<CourseHole>(
        (row) => ({
          holeNumber: row.hole_number,
          par: row.par as Par,
          strokeIndex: row.stroke_index,
        }),
      ),
      createdAt: courseRow.created_at,
      updatedAt: courseRow.updated_at,
    };
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync(
      'DELETE FROM courses WHERE id = $id;',
      {
        $id: id,
      },
    );
  }
}
