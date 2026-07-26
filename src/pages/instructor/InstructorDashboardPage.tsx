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

export function InstructorDashboardPage() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return <div className="text-sm text-surface-muted">Loading your courses…</div>;
  }

  const myCourses = courses?.filter((c) => c.instructorId === CURRENT_INSTRUCTOR_ID) ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-navy-700">Your courses ({myCourses.length})</div>
        <Link to="/instructor/courses/new">
          <Button variant="primary">+ New course</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {myCourses.map((course) => (
          <Card key={course.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-navy-900">{course.title}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}>
                {statusLabels[course.status]}
              </span>
            </div>
            <p className="text-xs text-surface-muted">{course.description}</p>
          </Card>
        ))}
        {myCourses.length === 0 && (
          <div className="text-sm text-surface-muted">You haven't created any courses yet.</div>
        )}
      </div>
    </div>
  );
}