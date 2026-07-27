export type UserRole =
  | "student"
  | "instructor"
  | "institution_admin"
  | "corporate_admin"
  | "super_admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: string;
}

export type CourseStatus = "draft" | "pending_review" | "published";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  status: CourseStatus;
  price: number;
  thumbnailUrl?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  position: number;
  isFree: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: "video" | "text";
  contentUrl: string;
  durationSeconds?: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completionPct: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  startedAt: string;
  submittedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  verificationHash: string;
}

export type NotificationType = "deadline" | "grade" | "announcement" | "new_content";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}