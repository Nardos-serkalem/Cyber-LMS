import { apiFetch } from "./client";
import type { Lesson } from "../../types";

export async function fetchLessons(moduleId: string): Promise<Lesson[]> {
  return apiFetch<Lesson[]>(`/modules/${moduleId}/lessons`);
}

export async function fetchLesson(lessonId: string): Promise<Lesson> {
  return apiFetch<Lesson>(`/lessons/${lessonId}`);
}

export async function createLesson(
  moduleId: string,
  input: Pick<Lesson, "title" | "type" | "contentUrl" | "durationSeconds">,
): Promise<Lesson> {
  return apiFetch<Lesson>(`/modules/${moduleId}/lessons`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateLesson(
  lessonId: string,
  input: Partial<Pick<Lesson, "title" | "type" | "contentUrl" | "durationSeconds">>,
): Promise<Lesson> {
  return apiFetch<Lesson>(`/lessons/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteLesson(lessonId: string): Promise<void> {
  return apiFetch<void>(`/lessons/${lessonId}`, { method: "DELETE" });
}
