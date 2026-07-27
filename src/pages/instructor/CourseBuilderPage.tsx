import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "../../lib/queries/useCreateCourse";
import { CourseEditorForm } from "./CourseEditorForm";

const CURRENT_INSTRUCTOR_ID = "instructor-1";

export function CourseBuilderPage() {
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  return (
    <CourseEditorForm
      mode="create"
      initialValues={{
        title: "",
        description: "",
        instructorId: CURRENT_INSTRUCTOR_ID,
        status: "draft",
        price: 0,
        thumbnailUrl: undefined,
      }}
      onSubmit={(values) =>
        createCourse.mutate(values, {
          onSuccess: () => navigate("/instructor/dashboard"),
        })
      }
      isSubmitting={createCourse.isPending}
      submitLabel="Create course"
      submitPendingLabel="Creating…"
      onCancel={() => navigate("/instructor/dashboard")}
    />
  );
}