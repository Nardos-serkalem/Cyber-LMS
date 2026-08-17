import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInstructorCourses } from "../../lib/queries/useInstructorCourses";
import {
  deleteCourse,
  publishCourse,
  submitCourse,
} from "../../lib/api/courses";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { CourseStatus } from "../../types";

const statusStyles: Record<CourseStatus, string> = {
  draft: "border border-navy-200 bg-surface-canvas text-surface-muted",
  pending_review: "border border-warning bg-surface-card text-warning",
  published: "border border-lemon-500 bg-lemon-50 text-navy-700",
};

const statusLabels: Record<CourseStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

export function InstructorDashboardPage() {
  const { data: courses, isLoading } = useInstructorCourses();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

  const submitMutation = useMutation({
    mutationFn: submitCourse,
    onSuccess: invalidate,
  });
  const publishMutation = useMutation({
    mutationFn: publishCourse,
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: invalidate,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-surface-muted">Loading your courses…</div>
    );
  }

  const myCourses = courses ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-navy-700">
          Your courses ({myCourses.length})
        </div>
        <Link to="/instructor/courses/new">
          <Button variant="primary">+ New course</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {myCourses.map((course) => (
          <Card key={course.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-navy-900">
                {course.title}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}
              >
                {statusLabels[course.status]}
              </span>
            </div>
            <p className="mb-3 text-xs text-surface-muted">{course.description}</p>
            <div className="flex flex-wrap gap-2">
              {course.status === "draft" && (
                <>
                  <Button
                    variant="secondary"
                    className="text-xs"
                    disabled={submitMutation.isPending}
                    onClick={() => submitMutation.mutate(course.id)}
                  >
                    Submit for review
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-xs"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(course.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
              {(course.status === "draft" || course.status === "pending_review") && (
                <Button
                  variant="primary"
                  className="text-xs"
                  disabled={publishMutation.isPending}
                  onClick={() => publishMutation.mutate(course.id)}
                >
                  Publish
                </Button>
              )}
            </div>
          </Card>
        ))}
        {myCourses.length === 0 && (
          <div className="text-sm text-surface-muted">
            You haven't created any courses yet.
          </div>
        )}
      </div>
    </div>
  );
}
