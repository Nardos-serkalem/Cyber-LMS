import { apiFetch } from "./client";
import type { Module } from "../../types";

export async function fetchModules(courseId: string): Promise<Module[]> {
  return apiFetch<Module[]>(`/courses/${courseId}/modules`);
}

export async function createModule(
  courseId: string,
  input: { title: string; position?: number; isFree: boolean },
): Promise<Module> {
  return apiFetch<Module>(`/courses/${courseId}/modules`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateModule(
  moduleId: string,
  input: Partial<Pick<Module, "title" | "position" | "isFree">>,
): Promise<Module> {
  return apiFetch<Module>(`/modules/${moduleId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteModule(moduleId: string): Promise<void> {
  return apiFetch<void>(`/modules/${moduleId}`, { method: "DELETE" });
}
