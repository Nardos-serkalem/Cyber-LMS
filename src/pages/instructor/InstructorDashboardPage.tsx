import { Link } from "react-router-dom";
import { useCourses } from "../../lib/queries/useCourses";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { CourseStatus } from "../../types";

const CURRENT_INSTRUCTOR_ID = "instructor-1";

const statusStyles: Record<CourseStatus, string> = {
  draft: "border border-navy-200 bg-surface-canvas text-surface-muted",
  pending_review: "border border-warning bg-white text-warning",
  published: "border border-lemon-500 bg-lemon-50 text-lemon-700",
};

const statusLabels: Record<CourseStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

const statusCopy: Record<CourseStatus, string> = {
  draft: "Still shaping the course content.",
  pending_review: "Ready for review before publishing.",
  published: "Live and available to learners.",
};

export function InstructorDashboardPage() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return <div className="text-sm text-surface-muted">Loading your courses…</div>;
  }

  const myCourses = courses?.filter((c) => c.instructorId === CURRENT_INSTRUCTOR_ID) ?? [];
  const publishedCourses = myCourses.filter((course) => course.status === "published").length;
  const pendingReviewCourses = myCourses.filter((course) => course.status === "pending_review").length;
  const draftCourses = myCourses.filter((course) => course.status === "draft").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-navy-200 bg-surface-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-surface-muted">
            Instructor overview
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900">Keep your course catalog moving</h2>
          <p className="mt-2 max-w-2xl text-sm text-surface-muted">
            Track draft progress, review-ready courses, and what is already published from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/instructor/courses/new">
            <Button variant="primary">+ New course</Button>
          </Link>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="mb-3.5 text-lg font-bold text-navy-900">Quick stats</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total courses" value={myCourses.length} accent="border-navy-900" />
          <StatCard label="Published" value={publishedCourses} accent="border-lemon-500" />
          <StatCard label="Pending review" value={pendingReviewCourses} accent="border-warning" />
          <StatCard label="Drafts" value={draftCourses} accent="border-info" />
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900">Course pipeline</h3>
              <p className="text-sm text-surface-muted">A snapshot of your current publishing status.</p>
            </div>
            <span className="rounded-full border border-navy-200 px-3 py-1 text-xs font-medium text-surface-muted">
              {myCourses.length} total
            </span>
          </div>
          <div className="space-y-4">
            {(Object.keys(statusLabels) as CourseStatus[]).map((status) => {
              const count = myCourses.filter((course) => course.status === status).length;
              const percent = myCourses.length === 0 ? 0 : Math.round((count / myCourses.length) * 100);

              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-900">{statusLabels[status]}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
                      {count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-navy-50">
                    <div
                      className={`h-full rounded-full ${
                        status === "published"
                          ? "bg-lemon-500"
                          : status === "pending_review"
                            ? "bg-warning"
                            : "bg-info"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-navy-900">What to do next</h3>
          <div className="mt-4 space-y-3 text-sm text-surface-muted">
            <p>1. Finish any draft content and add the missing modules.</p>
            <p>2. Move ready courses to review so they can be published faster.</p>
            <p>3. Keep published courses current with small content updates.</p>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Your courses</h3>
            <p className="text-sm text-surface-muted">Manage titles, descriptions, and publishing status.</p>
          </div>
          <span className="text-sm font-medium text-surface-muted">{myCourses.length} courses</span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {myCourses.map((course) => (
            <Card key={course.id} className="flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-navy-900">{course.title}</h4>
                  <p className="mt-1 text-sm text-surface-muted">{course.description}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}>
                  {statusLabels[course.status]}
                </span>
              </div>

              <p className="mb-4 text-sm text-navy-700">{statusCopy[course.status]}</p>

              <div className="mt-auto flex flex-wrap gap-2">
                <Link to={`/instructor/courses/${course.id}/edit`}>
                  <Button variant="secondary" className="min-w-32">Edit course</Button>
                </Link>
                <Link to={`/instructor/courses/${course.id}`}>
                  <Button variant="ghost" className="min-w-32">View details</Button>
                </Link>
              </div>
            </Card>
          ))}

          {myCourses.length === 0 && (
            <Card>
              <p className="text-sm text-surface-muted">You haven't created any courses yet.</p>
              <Link to="/instructor/courses/new" className="mt-4 inline-block">
                <Button variant="primary">Create your first course</Button>
              </Link>
            </Card>
          )}
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
    <Card className="transition-colors hover:bg-surface-canvas">
      <p className="text-3xl font-bold text-navy-900">{value}</p>
      <p className={`mt-2 border-l-[3px] pl-2 text-[13px] text-surface-muted ${accent}`}>{label}</p>
    </Card>
  );
}