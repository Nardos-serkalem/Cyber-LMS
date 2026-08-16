import { useQuery } from "@tanstack/react-query";
import { fetchLesson } from "../api/lessons";

export function useLesson(lessonId: string) {
  return useQuery({ queryKey: ["lesson", lessonId], queryFn: () => fetchLesson(lessonId) });
}