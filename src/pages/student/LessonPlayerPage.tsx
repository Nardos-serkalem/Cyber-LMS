import { useParams, Link } from "react-router-dom";
import { useLesson } from "../../lib/queries/useLesson";
import { Button } from "../../components/ui/Button";

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { data: lesson, isLoading } = useLesson(lessonId ?? "");

  if (isLoading || !lesson) {
    return <div className="text-sm text-surface-muted">Loading lesson…</div>;
  }

  return (
    <div className="max-w-2xl">
      <Link to={`/courses/${courseId}`} className="mb-4 inline-block text-xs text-navy-700 hover:underline">
        ← Back to course
      </Link>
      <div className="mb-3 text-base font-medium text-navy-900">{lesson.title}</div>

      {lesson.type === "video" ? (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-navy-900 text-sm text-navy-200">
          Video player placeholder — HLS streaming wires in here
        </div>
      ) : (
        <div className="rounded-xl border border-navy-200 bg-surface-card p-5 text-sm text-navy-900">
          Text lesson content placeholder.
        </div>
      )}

      <Button variant="primary" className="mt-4">
        Mark complete
      </Button>
    </div>
  );
}