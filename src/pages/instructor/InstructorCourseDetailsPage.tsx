import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourses } from "../../lib/queries/useCourses";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const CURRENT_INSTRUCTOR_ID = "instructor-1";

const statusLabels = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
} as const;

const statusCopy = {
  draft: "Keep building the structure, lessons, and assessments before review.",
  pending_review: "The course is ready for a final instructor pass.",
  published: "The course is live and discoverable by learners.",
} as const;

export function InstructorCourseDetailsPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();

  const course = useMemo(
    () => courses?.find((item) => item.id === courseId && item.instructorId === CURRENT_INSTRUCTOR_ID),
    [courseId, courses],
  );

  if (isLoading) {
    return <div className="text-sm text-surface-muted">Loading course details…</div>;
  }

  if (!course) {
    return (
      <Card className="max-w-xl">
        <h3 className="text-lg font-bold text-navy-900">Course not found</h3>
        <p className="mt-2 text-sm text-surface-muted">
          The course you are looking for is not available in your instructor catalog.
        </p>
        <Button type="button" variant="primary" className="mt-4" onClick={() => navigate("/instructor/dashboard")}> 
          Back to dashboard
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
      <Card className="overflow-hidden shadow-sm">
        <div className="flex h-40 items-center justify-between rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-lemon-700 p-6 text-lemon-500">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lemon-50">Course details</p>
            <h3 className="mt-2 text-3xl font-black text-lemon-500">{course.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-lemon-50/90">{course.description}</p>
          </div>
          <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur sm:block">
            <div className="text-xs uppercase tracking-[0.2em] text-lemon-50/80">Current status</div>
            <div className="mt-1 text-lg font-bold text-white">{statusLabels[course.status]}</div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <InfoTile label="Price" value={course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`} />
          <InfoTile label="Instructor" value={course.instructorId} />
          <InfoTile label="Course ID" value={course.id} />
          <InfoTile label="Visibility" value={statusLabels[course.status]} />
        </div>

        <div className="border-t border-navy-200 px-5 py-4 text-sm text-surface-muted">
          {statusCopy[course.status]}
        </div>
      </Card>

      <div className="grid gap-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-muted">Actions</p>
          <h4 className="mt-1 text-lg font-bold text-navy-900">Manage this course</h4>
          <div className="mt-4 flex flex-col gap-3">
            <Link to={`/instructor/courses/${course.id}/edit`}>
              <Button variant="primary" className="w-full">Edit course</Button>
            </Link>
            <Link to="/instructor/courses/new">
              <Button variant="ghost" className="w-full">Duplicate via new course</Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => navigate("/instructor/dashboard")}>
              Back to dashboard
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-muted">Publishing note</p>
          <p className="mt-2 text-sm leading-6 text-navy-700">
            This view is intentionally read-only so you can quickly check what learners will see before updating the course.
          </p>
        </Card>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-200 bg-surface-canvas px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-surface-muted">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold text-navy-900">{value}</div>
    </div>
  );
}