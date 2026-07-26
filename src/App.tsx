import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StudentDashboard } from "./pages/student/StudentDashboardPage";
import { CourseBrowsePage } from "./pages/student/CourseBrowsePage";
import { InstructorDashboardPage } from "./pages/instructor/InstructorDashboardPage";
import { CourseBuilderPage } from "./pages/instructor/CourseBuilderPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { useAuthStore } from "./store/authStore";
import { MyCoursesPage } from "./pages/student/MyCoursesPage";
import { CertificatesPage } from "./pages/student/CertificatesPage";
import { NotificationsPage } from "./pages/student/NotificationsPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout title="Dashboard overview" subtitle="Welcome back, here is your learning progress">
              <StudentDashboard />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <DashboardLayout title="Browse courses" subtitle="Find your next course">
              <CourseBrowsePage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout title="Instructor dashboard" subtitle="Manage your courses">
              <InstructorDashboardPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/courses/new"
        element={
          <RequireAuth>
            <DashboardLayout title="Course builder" subtitle="Create a new course">
              <CourseBuilderPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
   <Route
  path="/my-courses"
  element={
    <RequireAuth>
      <DashboardLayout title="My courses" subtitle="Everything you're enrolled in">
        <MyCoursesPage />
      </DashboardLayout>
    </RequireAuth>
  }
/>
<Route
  path="/certificates"
  element={
    <RequireAuth>
      <DashboardLayout title="Certificates" subtitle="Courses you've completed">
        <CertificatesPage />
      </DashboardLayout>
    </RequireAuth>
  }
/>
<Route
  path="/notifications"
  element={
    <RequireAuth>
      <DashboardLayout title="Notifications" subtitle="Deadlines, grades, announcements">
        <NotificationsPage />
      </DashboardLayout>
    </RequireAuth>
  }
/>
    </Routes>
  );
}

export default App;