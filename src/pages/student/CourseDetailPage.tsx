import { useParams } from "react-router-dom";
import { useCourses } from "../../lib/queries/useCourses";
import { useModules } from "../../lib/queries/useModules";
import { ModuleSection } from "../../components/shared/ModuleSection";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: modules, isLoading: modulesLoading } = useModules(courseId ?? "");

  if (coursesLoading || modulesLoading || !courseId) {
    return <div className="text-sm text-surface-muted">Loading course…</div>;
  }

  const course = courses?.find((c) => c.id === courseId);

  if (!course) {
    return <div className="text-sm text-surface-muted">Course not found.</div>;
  }

  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-surface-muted">{course.description}</p>
      {modules?.map((mod) => (
        <ModuleSection key={mod.id} module={mod} courseId={course.id} />
      ))}
      {modules?.length === 0 && <div className="text-sm text-surface-muted">No modules yet.</div>}
    </div>
  );
}