import { apiFetch } from "./client";

export interface CourseAnalytics {
  courseId: string;
  enrollmentCount: number;
  averageCompletionPct: number;
  completedCount: number;
  inProgressCount: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  score: number;
  startedAt: string;
  submittedAt?: string;
}

export async function fetchCourseEnrollments(courseId: string) {
  return apiFetch<import("../../types").Enrollment[]>(
    `/instructor/courses/${courseId}/enrollments`,
  );
}

export async function fetchCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
  return apiFetch<CourseAnalytics>(`/instructor/courses/${courseId}/analytics`);
}

export async function fetchQuizAttempts(courseId?: string): Promise<QuizAttempt[]> {
  const query = courseId ? `?course_id=${encodeURIComponent(courseId)}` : "";
  return apiFetch<QuizAttempt[]>(`/instructor/quiz-attempts${query}`);
}

export async function gradeQuizAttempt(attemptId: string, score: number): Promise<QuizAttempt> {
  return apiFetch<QuizAttempt>(`/instructor/quiz-attempts/${attemptId}`, {
    method: "PATCH",
    body: JSON.stringify({ score }),
  });
}
