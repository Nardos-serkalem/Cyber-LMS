import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  title: string;
  subtitle?: string;
  userInitials: string;
}

export function Navbar({ title, subtitle, userInitials }: NavbarProps) {
  const { role, setRole, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleRoleSwitch(nextRole: "student" | "instructor") {
    setRole(nextRole);
    navigate(nextRole === "student" ? "/dashboard" : "/instructor/dashboard");
  }

  return (
    <div className="flex items-center justify-between border-b border-surface-divider bg-surface-card px-6 py-4">
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lemon-700">
          {role === "student" ? "Student workspace" : role === "instructor" ? "Instructor workspace" : "Workspace"}
        </div>
        <div className="text-xl font-semibold leading-tight text-navy-900">{title}</div>
        {subtitle && <div className="max-w-2xl text-sm text-surface-muted">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleRoleSwitch("student")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            role === "student"
              ? "border-lemon-500 bg-lemon-500 text-navy-900"
              : "border-navy-200 bg-surface-card text-surface-muted hover:bg-lemon-50"
          }`}
        >
          Students
        </button>
        <button
          type="button"
          onClick={() => handleRoleSwitch("instructor")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            role === "instructor"
              ? "border-lemon-500 bg-lemon-500 text-navy-900"
              : "border-navy-200 bg-surface-card text-surface-muted hover:bg-lemon-50"
          }`}
        >
          Instructors
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-navy-200 bg-surface-card px-3 py-1.5 text-xs font-medium text-surface-muted transition-colors hover:bg-lemon-50 hover:text-navy-900"
        >
          Logout
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-lemon-500 bg-lemon-50 text-sm font-medium text-lemon-700">
          {userInitials}
        </div>
      </div>
    </div>
  );
}