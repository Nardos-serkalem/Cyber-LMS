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
  icon: ComponentType<{ size?: number }>;
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My courses", path: "/my-courses", icon: BookOpen },
    { label: "Browse", path: "/courses", icon: Compass },
    { label: "Certificates", path: "/certificates", icon: Award },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ],
  instructor: [
    { label: "Dashboard", path: "/instructor/dashboard", icon: LayoutDashboard },
    { label: "Course builder", path: "/instructor/courses/new", icon: BookOpen },
    { label: "Learners", path: "/instructor/dashboard", icon: Users },
    { label: "Grading", path: "/instructor/dashboard", icon: ClipboardCheck },
    { label: "Analytics", path: "/instructor/dashboard", icon: BarChart3 },
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

  return (
    <aside className="flex h-full w-[210px] flex-shrink-0 flex-col bg-navy-900 px-3.5 py-5">
      <div className="mb-7 px-2.5 text-base font-medium text-lemon-500">Cyber-Zeb LMS</div>
      <nav className="flex flex-col gap-1">
        {items.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-lemon-500 text-navy-900"
                  : "text-navy-200 hover:bg-navy-700 hover:text-lemon-500"
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