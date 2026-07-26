import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: Boolean(userId),
  });
}
