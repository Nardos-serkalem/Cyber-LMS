import { create } from "zustand";
import { fetchMe, login as apiLogin, logoutApi, register as apiRegister } from "../lib/api/auth";
import type { UserRole } from "../types";

interface AuthState {
  userId: string | null;
  role: UserRole;
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    fullName: string;
    role?: "student" | "instructor";
  }) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: "student",
  fullName: "",
  email: "",
  isAuthenticated: false,
  isLoading: true,
  setRole: (role) => set({ role }),
  login: async (email, password) => {
    const user = await apiLogin(email, password);
    set({
      userId: user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      isAuthenticated: true,
    });
  },
  register: async (input) => {
    const user = await apiRegister(input);
    set({
      userId: user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      isAuthenticated: true,
    });
  },
  logout: () => {
    logoutApi();
    set({
      userId: null,
      role: "student",
      fullName: "",
      email: "",
      isAuthenticated: false,
    });
  },
  restoreSession: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await fetchMe();
      set({
        userId: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      logoutApi();
      set({ isLoading: false });
    }
  },
}));
