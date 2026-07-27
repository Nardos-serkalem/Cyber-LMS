import { apiFetch } from "./client";
import type { Notification } from "../../types";

export async function fetchNotifications(userId?: string): Promise<Notification[]> {
  const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  return apiFetch<Notification[]>(`/notifications${query}`);
}
