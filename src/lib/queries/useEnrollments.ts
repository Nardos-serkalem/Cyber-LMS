import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEnrollment, fetchEnrollments, updateEnrollmentProgress } from "../api/enrollments";

export function useEnrollments(userId: string) {
  return useQuery({
    queryKey: ["enrollments", userId],
    queryFn: () => fetchEnrollments(userId),
    enabled: Boolean(userId), // don't fire until we actually have a logged-in user id
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEnrollment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", variables.userId] });
    },
  });
}

export function useUpdateEnrollmentProgress(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, completionPct }: { enrollmentId: string; completionPct: number }) =>
      updateEnrollmentProgress(enrollmentId, completionPct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] });
    },
  });
}
