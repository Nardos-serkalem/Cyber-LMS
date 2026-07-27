import { Link } from "react-router-dom";
import { useCourses } from "../../lib/queries/useCourses";
import { useEnrollments } from "../../lib/queries/useEnrollments";
import { useNotifications } from "../../lib/queries/useNotifications";
import { Badge } from "../../components/ui/Badge";
import type { BadgeStatus } from "../../components/ui/Badge";

// Placeholder until a real Instructor/User lookup exists — courses only
// store instructorId today, not a display name.
const instructorNames: Record<string, string> = {
  "instructor-1": "Dr. A. Bekele",
  "instructor-2": "S. Tesfaye",
};

function badgeForNotification(message: string): BadgeStatus {
  return message.toLowerCase().includes("overdue") ? "overdue" : "pending";
}

export function StudentDashboardPage() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  if (coursesLoading || enrollmentsLoading || notificationsLoading) {
    return <div className="text-sm text-surface-muted">Loading dashboard…</div>;
  }

  const total = enrollments?.length ?? 0;
  const completed =
    enrollments?.filter((e) => e.completionPct === 100).length ?? 0;
  const inProgressCount = total - completed;
  const avgProgress =
    total === 0
      ? 0
      : Math.round(
          (enrollments?.reduce((sum, e) => sum + e.completionPct, 0) ?? 0) /
            total,
        );

  const courseFor = (courseId: string) =>
    courses?.find((c) => c.id === courseId);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Link
          to="/courses"
          className="whitespace-nowrap rounded-lg border-[1.5px] border-lemon-500 bg-lemon-500 px-4 py-2 text-sm font-bold text-navy-900 transition-colors hover:bg-lemon-50 active:bg-lemon-700 active:text-white"
        >
          Browse Course Library →
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="mb-3.5 text-lg font-bold text-navy-900">
          Progress Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Enrolled Courses"
            value={total}
            accent="border-navy-900"
          />
          <StatCard
            label="Completed"
            value={completed}
            accent="border-lemon-500"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            accent="border-status-info"
          />
          <StatCard
            label="Average Progress"
            value={`${avgProgress}%`}
            accent="border-lemon-500"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3.5 text-lg font-bold text-navy-900">My Courses</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments?.map((enrollment) => {
            const course = courseFor(enrollment.courseId);
            if (!course) return null;
            const initials = course.title
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={enrollment.id}
                className="flex flex-col overflow-hidden rounded-xl border border-navy-200 bg-lemon-50 transition-colors hover:bg-surface-card"
              >
                <div className="flex h-[90px] items-center justify-center bg-navy-900 text-xl font-bold tracking-wide text-lemon-500">
                  {initials}
                </div>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="mb-1 text-base font-bold text-navy-900 hover:underline"
                  >
                    {course.title}
                  </Link>
                  <p className="mb-1.5 text-[13px] text-navy-900">
                    {instructorNames[course.instructorId] ?? "Instructor"}
                  </p>

                  <div className="mt-2 h-2 overflow-hidden rounded-full border border-navy-200 bg-navy-50">
                    <div
                      className={`h-full rounded-full transition-all ${
                        enrollment.completionPct === 100
                          ? "bg-lemon-700"
                          : "bg-lemon-500"
                      }`}
                      style={{ width: `${enrollment.completionPct}%` }}
                    />
                  </div>
                  <p className="mb-3 mt-1.5 text-xs text-navy-900">
                    {enrollment.completionPct}% complete
                  </p>

                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-auto w-full rounded-lg bg-lemon-500 py-2.5 text-center text-sm font-bold text-navy-900 transition-colors hover:bg-lemon-50 active:bg-lemon-700 active:text-white"
                  >
                    {enrollment.completionPct === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3.5 text-lg font-bold text-navy-900">
          Notifications
        </h2>
        <div className="divide-y divide-surface-divider rounded-xl border border-navy-200 bg-surface-card">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-navy-900">
                {notification.message}
              </span>
              <Badge status={badgeForNotification(notification.message)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-[10px] border border-navy-200 bg-lemon-50 px-5 py-4 transition-colors hover:bg-surface-card">
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p
        className={`mt-2 border-l-[3px] pl-2 text-[13px] text-surface-muted ${accent}`}
      >
        {label}
      </p>
    </div>
  );
}
