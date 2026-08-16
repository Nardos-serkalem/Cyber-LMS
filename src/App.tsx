import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StudentDashboard } from "./pages/student/StudentDashboardPage";
import { CourseBrowsePage } from "./pages/student/CourseBrowsePage";
import { InstructorDashboardPage } from "./pages/instructor/InstructorDashboardPage";
import { CourseBuilderPage } from "./pages/instructor/CourseBuilderPage";
import { InstructorCourseEditPage } from "./pages/instructor/InstructorCourseEditPage";
import { InstructorCourseDetailsPage } from "./pages/instructor/InstructorCourseDetailsPage";
import { InstructorLearnersPage } from "./pages/instructor/InstructorLearnersPage";
import { InstructorGradingPage } from "./pages/instructor/InstructorGradingPage";
import { InstructorAnalyticsPage } from "./pages/instructor/InstructorAnalyticsPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { MyCoursesPage } from "./pages/student/MyCoursesPage";
import { CertificatesPage } from "./pages/student/CertificatesPage";
import { NotificationsPage } from "./pages/student/NotificationsPage";
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
        path="/my-courses"
        element={
          <RequireAuth>
            <DashboardLayout title="My courses" subtitle="Track your enrolled courses">
              <MyCoursesPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/certificates"
        element={
          <RequireAuth>
            <DashboardLayout title="Certificates" subtitle="Your earned certificates">
              <CertificatesPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <DashboardLayout title="Notifications" subtitle="Your recent notifications">
              <NotificationsPage />
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
            <DashboardLayout title="Course builder" subtitle="Create or refine a course">
              <CourseBuilderPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/courses/:courseId"
        element={
          <RequireAuth>
            <DashboardLayout title="Course details" subtitle="Review the current course state">
              <InstructorCourseDetailsPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/courses/:courseId/edit"
        element={
          <RequireAuth>
            <DashboardLayout title="Edit course" subtitle="Update the selected course">
              <InstructorCourseEditPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/learners"
        element={
          <RequireAuth>
            <DashboardLayout title="Learners" subtitle="Track enrollments and learner activity">
              <InstructorLearnersPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/grading"
        element={
          <RequireAuth>
            <DashboardLayout title="Grading" subtitle="Review submissions and manage assessments">
              <InstructorGradingPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/instructor/analytics"
        element={
          <RequireAuth>
            <DashboardLayout title="Analytics" subtitle="Review course performance and trends">
              <InstructorAnalyticsPage />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;