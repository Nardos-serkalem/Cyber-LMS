import { useQuery } from "@tanstack/react-query";
import { fetchEnrollments } from "../api/enrollments";

export function useEnrollments(userId: string) {
  return useQuery({ queryKey: ["enrollments", userId], queryFn: () => fetchEnrollments(userId) });
}