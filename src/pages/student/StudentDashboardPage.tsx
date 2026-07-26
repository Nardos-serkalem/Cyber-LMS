import { Link } from "react-router-dom";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number; // 0–100
  totalLessons: number;
  completedLessons: number;
  nextDeadline?: string;
  deadlineStatus?: "info" | "warning" | "danger";
  thumbnailLabel: string;
}

const enrolledCourses: EnrolledCourse[] = [
  {
    id: "e1",
    title: "Intro to Data Structures",
    instructor: "Dr. A. Bekele",
    progress: 72,
    totalLessons: 18,
    completedLessons: 13,
    nextDeadline: "Assignment due in 2 days",
    deadlineStatus: "warning",
    thumbnailLabel: "DS",
  },
  {
    id: "e2",
    title: "UI/UX Fundamentals",
    instructor: "S. Tesfaye",
    progress: 45,
    totalLessons: 12,
    completedLessons: 5,
    nextDeadline: "Quiz overdue",
    deadlineStatus: "danger",
    thumbnailLabel: "UX",
  },
  {
    id: "e3",
    title: "Business Communication",
    instructor: "M. Alemu",
    progress: 100,
    totalLessons: 10,
    completedLessons: 10,
    nextDeadline: "Course complete",
    deadlineStatus: "info",
    thumbnailLabel: "BC",
  },
];

const statusClasses = (status?: "info" | "warning" | "danger") => {
  switch (status) {
    case "warning":
      return "bg-status-warningBg text-status-warningText border border-transparent";
    case "danger":
      return "bg-status-dangerBg text-status-dangerText border border-transparent";
    default:
      return "bg-status-infoBg text-status-infoText border border-transparent";
  }
};

const overallStats = (courses: EnrolledCourse[]) => {
  const total = courses.length;
  const completed = courses.filter((c) => c.progress === 100).length;
  const inProgress = total - completed;
  const avgProgress =
    total === 0
      ? 0
      : Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / total);
  return { total, completed, inProgress, avgProgress };
};

export function StudentDashboard() {
  const stats = overallStats(enrolledCourses);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Link
          to="/courses"
          className="whitespace-nowrap rounded-lg border-[1.5px] border-lemon-500 bg-white px-4 py-2 text-sm font-bold text-lemon-700 transition-colors hover:bg-lemon-50 active:bg-lemon-700 active:text-white"
        >
          Browse Course Library →
        </Link>
      </div>

      {/* Progress Overview */}
      <section className="mb-8">
        <h2 className="mb-3.5 text-lg font-bold text-navy-900">Progress Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Enrolled Courses" value={stats.total} accent="border-navy-900" />
          <StatCard label="Completed" value={stats.completed} accent="border-lemon-500" />
          <StatCard label="In Progress" value={stats.inProgress} accent="border-info" />
          <StatCard
            label="Average Progress"
            value={`${stats.avgProgress}%`}
            accent="border-lemon-500"
          />
        </div>
      </section>

      {/* Enrolled Courses */}
      <section>
        <h2 className="mb-3.5 text-lg font-bold text-navy-900">My Courses</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-xl border border-navy-200 bg-lemon-50 transition-all hover:bg-surface-card hover:shadow-md"
            >
              <div className="flex h-[90px] items-center justify-center bg-navy-900 text-xl font-bold tracking-wide text-lemon-500">
                {course.thumbnailLabel}
              </div>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                <h3 className="mb-1 text-base font-bold text-navy-900">{course.title}</h3>
                <p className="mb-1.5 text-[13px] text-navy-700 font-medium">{course.instructor}</p>

                <div className="mt-2 h-2 overflow-hidden rounded-full border border-navy-200 bg-navy-50">
                  <div
                    className={`h-full rounded-full transition-all ${
                      course.progress === 100 ? "bg-lemon-700" : "bg-lemon-500"
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="mb-2.5 mt-1.5 text-xs text-navy-600">
                  {course.completedLessons}/{course.totalLessons} lessons ·{" "}
                  {course.progress}%
                </p>

                {course.nextDeadline && (
                  <span
                    className={`mb-3 inline-block w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                      course.deadlineStatus
                    )}`}
                  >
                    {course.nextDeadline}
                  </span>
                )}

                <button className="mt-auto w-full rounded-lg bg-lemon-500 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-lemon-200 active:bg-lemon-700">
                  {course.progress === 100 ? "Review Course" : "Continue Learning"}
                </button>
              </div>
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
      <p className={`mt-2 border-l-[3px] pl-2 text-[13px] text-surface-muted ${accent}`}>
        {label}
      </p>
    </div>
  );
}