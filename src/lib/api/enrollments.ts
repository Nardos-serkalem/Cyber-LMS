import { mockDelay } from "./client";
import { enrollments } from "../mockData/enrollments";
import type { Enrollment } from "../../types";

export async function fetchEnrollments(userId: string): Promise<Enrollment[]> {
  return mockDelay(enrollments.filter((e) => e.userId === userId));
}