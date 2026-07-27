import { create } from "zustand";
import type { UserRole } from "../types";

interface AuthState {
  role: UserRole;
  fullName: string;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  login: (fullName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "student",
  fullName: "Yonatan Shitaye",
  isAuthenticated: false,
  setRole: (role) => set({ role }),
  login: (fullName) => set({ isAuthenticated: true, fullName }),
  logout: () => set({ isAuthenticated: false }),
}));