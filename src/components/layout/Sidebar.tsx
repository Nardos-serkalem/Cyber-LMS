import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Award,
  Bell,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";
import type { UserRole } from "../../types";

interface NavItem {
  label: string;
  path: string;
  section?: string;
  icon: ComponentType<{ size?: number }>;
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard", path: "/dashboard", section: "overview", icon: LayoutDashboard },
    { label: "My courses", path: "/dashboard", section: "courses", icon: BookOpen },
    { label: "Browse", path: "/courses", icon: Compass },
    { label: "Certificates", path: "/dashboard", section: "certificates", icon: Award },
    { label: "Notifications", path: "/dashboard", section: "notifications", icon: Bell },
  ],
  instructor: [
    { label: "Dashboard", path: "/instructor/dashboard", icon: LayoutDashboard },
    { label: "Course builder", path: "/instructor/courses/new", icon: BookOpen },
    { label: "Learners", path: "/instructor/learners", icon: Users },
    { label: "Grading", path: "/instructor/grading", icon: ClipboardCheck },
    { label: "Analytics", path: "/instructor/analytics", icon: BarChart3 },
  ],
  institution_admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Reporting", path: "/dashboard", icon: BarChart3 },
    { label: "Users", path: "/dashboard", icon: Users },
    { label: "Settings", path: "/dashboard", icon: Settings },
  ],
  corporate_admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Reporting", path: "/dashboard", icon: BarChart3 },
    { label: "Users", path: "/dashboard", icon: Users },
    { label: "Settings", path: "/dashboard", icon: Settings },
  ],
  super_admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Reporting", path: "/dashboard", icon: BarChart3 },
    { label: "Users", path: "/dashboard", icon: Users },
    { label: "Settings", path: "/dashboard", icon: Settings },
  ],
};

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const items = navItemsByRole[role];
  const location = useLocation();
  const activeSection = new URLSearchParams(location.search).get("section") ?? "overview";

  return (
    <aside className="flex h-full w-[210px] flex-shrink-0 flex-col bg-navy-900 px-3.5 py-5 shadow-[inset_-1px_0_0_rgba(197,202,222,0.18)]">
      <div className="mb-7 rounded-xl border border-navy-700 bg-navy-900 px-3 py-3 shadow-[0_10px_24px_rgba(27,35,64,0.28)]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-surface-card shadow-sm ring-1 ring-white/10">
            <img src="/Branalms.jpg" alt="Branalms logo" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-navy-50">
              Brana
            </div>
            <div className="text-lg font-black uppercase leading-none tracking-[0.18em] text-lemon-500">
              LMS
            </div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ label, path, section, icon: Icon }) => {
          const isActive =
            location.pathname === path && (!section || section === activeSection);
          const target = section ? `${path}?section=${section}` : path;
          return (
            <Link
              key={label}
              to={target}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-lemon-500 text-navy-900 shadow-sm"
                  : "text-navy-200 hover:bg-lemon-50 hover:text-navy-900"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}