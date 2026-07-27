import { mockDelay } from "./client";
import { notifications } from "../mockData/notifications";
import type { Notification } from "../../types";

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  return mockDelay(notifications.filter((n) => n.userId === userId));
}