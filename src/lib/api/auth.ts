import { apiRequest } from "./client";
import type { User } from "../../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export async function registerUser(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email: input.email, password: input.password, fullName: input.fullName, role: "student" },
  });
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}
