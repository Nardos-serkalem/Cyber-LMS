import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "../types";

interface AuthState {
  id: string | null;
  email: string | null;
  fullName: string;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (session: { id: string; email: string; fullName: string; role: UserRole; token: string }) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      email: null,
      fullName: "",
      role: "student",
      token: null,
      isAuthenticated: false,
      setSession: ({ id, email, fullName, role, token }) =>
        set({ id, email, fullName, role, token, isAuthenticated: true }),
      // Demo-only: lets the navbar preview instructor vs student views without
      // a real role change on the backend. Doesn't touch the stored token.
      setRole: (role) => set({ role }),
      logout: () => set({ id: null, email: null, fullName: "", token: null, isAuthenticated: false }),
    }),
    {
      // NOTE: this key must match the one read directly in src/lib/api/client.ts
      name: "birana-lms-auth",
    }
  )
);
