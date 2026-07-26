import { apiRequest } from "./client";
import type { Enrollment } from "../../types";

export async function fetchEnrollments(userId: string): Promise<Enrollment[]> {
  return apiRequest<Enrollment[]>(`/enrollments?userId=${encodeURIComponent(userId)}`, { auth: true });
}

export async function createEnrollment(input: { userId: string; courseId: string }): Promise<Enrollment> {
  return apiRequest<Enrollment>("/enrollments", { method: "POST", body: input, auth: true });
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  completionPct: number
): Promise<Enrollment> {
  return apiRequest<Enrollment>(`/enrollments/${enrollmentId}`, {
    method: "PATCH",
    body: { completionPct },
    auth: true,
  });
}
