import type {
  Course,
  CourseSummary,
  NewCourse,
} from '../models/Course';

export interface CourseRepository {
  save(course: NewCourse): Promise<Course>;

  getAll(): Promise<CourseSummary[]>;

  getById(id: string): Promise<Course | null>;

  delete(id: string): Promise<void>;
}
