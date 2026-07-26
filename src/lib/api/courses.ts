import { apiRequest, mockDelay } from "./client";
import { courses as mockCourses } from "../mockData/courses";
import type { Course } from "../../types";

export async function fetchCourses(): Promise<Course[]> {
  return apiRequest<Course[]>("/courses");
}

export async function fetchCourseModules(courseId: string) {
  return apiRequest(`/courses/${courseId}/modules`);
}

// Course creation isn't part of the student-workflow backend handoff yet
// (instructor endpoints come later), so this still writes to the in-memory
// mock array for now — CourseBuilderPage keeps working without a 404.
export async function createCourse(input: Omit<Course, "id">): Promise<Course> {
  const newCourse: Course = { ...input, id: `course-${mockCourses.length + 1}` };
  mockCourses.push(newCourse);
  return mockDelay(newCourse);
}
