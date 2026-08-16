import { useQuery } from "@tanstack/react-query";
import { fetchInstructorCourses } from "../api/courses";

export function useInstructorCourses() {
  return useQuery({
    queryKey: ["instructor", "courses"],
    queryFn: fetchInstructorCourses,
  });
}
