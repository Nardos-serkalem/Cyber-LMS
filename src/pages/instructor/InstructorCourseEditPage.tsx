import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCourses } from "../../lib/queries/useCourses";
import { useUpdateCourse } from "../../lib/queries/useUpdateCourse";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CourseEditorForm } from "./CourseEditorForm";

const CURRENT_INSTRUCTOR_ID = "instructor-1";

export function InstructorCourseEditPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useCourses();
  const updateCourse = useUpdateCourse();

  const course = useMemo(
    () => courses?.find((item) => item.id === courseId && item.instructorId === CURRENT_INSTRUCTOR_ID),
    [courseId, courses],
  );

  if (isLoading) {
    return <div className="text-sm text-surface-muted">Loading course…</div>;
  }

  if (!course) {
    return (
      <Card className="max-w-xl">
        <h3 className="text-lg font-bold text-navy-900">Course not found</h3>
        <p className="mt-2 text-sm text-surface-muted">
          The course you are trying to edit could not be found in your instructor catalog.
        </p>
        <Button type="button" variant="primary" className="mt-4" onClick={() => navigate("/instructor/dashboard")}> 
          Back to dashboard
        </Button>
      </Card>
    );
  }

  return (
    <CourseEditorForm
      mode="edit"
      initialValues={{
        title: course.title,
        description: course.description,
        instructorId: course.instructorId,
        status: course.status,
        price: course.price,
        thumbnailUrl: course.thumbnailUrl,
      }}
      onSubmit={(values) =>
        updateCourse.mutate(
          { courseId: course.id, values },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["courses"] });
              navigate(`/instructor/courses/${course.id}`);
            },
          },
        )
      }
      isSubmitting={updateCourse.isPending}
      submitLabel="Save changes"
      submitPendingLabel="Saving…"
      onCancel={() => navigate(`/instructor/courses/${course.id}`)}
    />
  );
}