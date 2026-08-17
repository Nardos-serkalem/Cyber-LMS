import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, type CreateCourseInput } from "../api/courses";

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCourseInput) => createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });
}