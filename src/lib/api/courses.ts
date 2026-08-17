import { apiFetch } from "./client";
import type { Course } from "../../types";

export async function fetchCourses(): Promise<Course[]> {
  return apiFetch<Course[]>("/courses");
}

export async function fetchInstructorCourses(): Promise<Course[]> {
  return apiFetch<Course[]>("/instructor/courses");
}

export async function fetchCourse(courseId: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}`);
}

export interface CreateCourseInput {
  title: string;
  description: string;
  status?: Course["status"];
  price: number;
  thumbnailUrl?: string;
  modules?: { title: string; isFree: boolean }[];
}

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  return apiFetch<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCourse(
  courseId: string,
  input: Partial<Pick<Course, "title" | "description" | "price" | "thumbnailUrl">>,
): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCourse(courseId: string): Promise<void> {
  return apiFetch<void>(`/courses/${courseId}`, { method: "DELETE" });
}

export async function submitCourse(courseId: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}/submit`, { method: "POST" });
}

export async function publishCourse(courseId: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}/publish`, { method: "POST" });
}
