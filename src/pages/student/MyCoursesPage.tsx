import { Link } from "react-router-dom";
import { useCourses } from "../../lib/queries/useCourses";
import { useEnrollments } from "../../lib/queries/useEnrollments";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";

export function MyCoursesPage() {
  const userId = useAuthStore((s) => s.id);
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments(userId ?? "");

  if (coursesLoading || enrollmentsLoading) {
    return <div className="text-sm text-surface-muted">Loading your courses…</div>;
  }

  const courseTitle = (courseId: string) => courses?.find((c) => c.id === courseId)?.title ?? "Untitled course";

  return (
    <div className="grid grid-cols-2 gap-3">
      {enrollments?.map((enrollment) => {
        const isCompleted = enrollment.completionPct === 100;
        return (
          <Card key={enrollment.id}>
            <div className="mb-2 flex items-center justify-between">
              <Link
                to={`/courses/${enrollment.courseId}`}
                className="text-sm font-medium text-navy-900 hover:underline"
              >
                {courseTitle(enrollment.courseId)}
              </Link>
              <Badge status={isCompleted ? "completed" : "inProgress"} />
            </div>
            <ProgressBar percent={enrollment.completionPct} label={`${enrollment.completionPct}% complete`} />
          </Card>
        );
      })}
      {enrollments?.length === 0 && (
        <div className="text-sm text-surface-muted">You're not enrolled in any courses yet.</div>
      )}
    </div>
  );
}