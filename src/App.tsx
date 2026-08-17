import { CourseDetailPage } from "./pages/student/CourseDetailPage";
import { LessonPlayerPage } from "./pages/student/LessonPlayerPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StudentDashboardPage } from "./pages/student/StudentDashboardPage";
import { CourseBrowsePage } from "./pages/student/CourseBrowsePage";
import { InstructorDashboardPage } from "./pages/instructor/InstructorDashboardPage";
import { CourseBuilderPage } from "./pages/instructor/CourseBuilderPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { useAuthStore } from "./store/authStore";

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
            <DashboardLayout
              title="Dashboard overview"
              subtitle="Welcome back, here is your learning progress"
            >
              <StudentDashboardPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <DashboardLayout
              title="Browse courses"
              subtitle="Find your next course"
            >
              <CourseBrowsePage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <RequireAuth>
            <DashboardLayout
              title="Course details"
              subtitle="Modules and lessons"
            >
              <CourseDetailPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <RequireAuth>
            <DashboardLayout title="Lesson" subtitle="">
              <LessonPlayerPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout
              title="Instructor dashboard"
              subtitle="Manage your courses"
            >
              <InstructorDashboardPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/courses/new"
        element={
          <RequireAuth>
            <DashboardLayout
              title="Course builder"
              subtitle="Create a new course"
            >
              <CourseBuilderPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
