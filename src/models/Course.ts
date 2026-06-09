export type Par = 3 | 4 | 5;

export interface CourseHole {
  holeNumber: number;
  par: Par;
  strokeIndex: number;
}

export interface Course {
  id: string;
  name: string;
  holes: CourseHole[];
  createdAt: string;
  updatedAt: string;
}

export interface NewCourse {
  name: string;
  holes: CourseHole[];
}

export interface CourseSummary {
  id: string;
  name: string;
  totalPar: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseHoleDraft {
  holeNumber: number;
  par: Par;
  strokeIndex: string;
}
