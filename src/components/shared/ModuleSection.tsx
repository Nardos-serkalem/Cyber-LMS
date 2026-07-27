import { Link } from "react-router-dom";
import { PlayCircle, FileText } from "lucide-react";
import { useLessons } from "../../lib/queries/useLessons";
import type { Module } from "../../types";

interface ModuleSectionProps {
  module: Module;
  courseId: string;
}

export function ModuleSection({ module, courseId }: ModuleSectionProps) {
  const { data: lessons, isLoading } = useLessons(module.id);

  return (
    <div className="mb-4 rounded-xl border border-navy-200 bg-surface-card">
      <div className="border-b border-surface-divider px-4 py-3 text-sm font-medium text-navy-700">
        {module.title}
      </div>
      <div className="divide-y divide-surface-divider">
        {isLoading && <div className="px-4 py-3 text-xs text-surface-muted">Loading lessons…</div>}
        {lessons?.map((lesson) => {
          const Icon = lesson.type === "video" ? PlayCircle : FileText;
          return (
            <Link
              key={lesson.id}
              to={`/courses/${courseId}/lessons/${lesson.id}`}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-navy-900 hover:bg-navy-50"
            >
              <Icon size={16} className="text-surface-muted" />
              {lesson.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}