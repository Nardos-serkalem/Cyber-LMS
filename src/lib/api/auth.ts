import { apiFetch, setAccessToken } from "./client";
import type { UserRole } from "../../types";

interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: string;
}

export async function login(email: string, password: string): Promise<UserResponse> {
  const token = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(token.accessToken);
  return fetchMe();
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
  role?: "student" | "instructor";
}): Promise<UserResponse> {
  const token = await apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAccessToken(token.accessToken);
  return fetchMe();
}

export async function fetchMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/auth/me");
}

export async function logoutApi(): Promise<void> {
  setAccessToken(null);
}
