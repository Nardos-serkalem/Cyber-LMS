import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "../api/modules";

export function useModules(courseId: string) {
  return useQuery({ queryKey: ["modules", courseId], queryFn: () => fetchModules(courseId) });
}