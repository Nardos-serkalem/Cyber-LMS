import { useQuery } from "@tanstack/react-query";
import { fetchLessons } from "../api/lessons";

export function useLessons(moduleId: string) {
  return useQuery({ queryKey: ["lessons", moduleId], queryFn: () => fetchLessons(moduleId) });
}