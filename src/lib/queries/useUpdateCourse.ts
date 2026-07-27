import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "../api/courses";
import type { Course } from "../../types";

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, values }: { courseId: string; values: Omit<Course, "id"> }) =>
      updateCourse(courseId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}