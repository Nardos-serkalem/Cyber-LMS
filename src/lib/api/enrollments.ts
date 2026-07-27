import { apiFetch } from "./client";
import type { Enrollment } from "../../types";

export async function fetchEnrollments(userId?: string): Promise<Enrollment[]> {
  const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  return apiFetch<Enrollment[]>(`/enrollments${query}`);
}
