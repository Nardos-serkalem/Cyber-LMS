import { apiRequest } from "./client";
import type { Notification } from "../../types";

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  return apiRequest<Notification[]>(`/notifications?userId=${encodeURIComponent(userId)}`, { auth: true });
}
