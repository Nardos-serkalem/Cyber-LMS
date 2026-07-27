import { useEffect, useMemo, useState } from "react";
import type { Course, CourseStatus } from "../../types";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export type CourseEditorValues = Omit<Course, "id">;

interface CourseEditorFormProps {
  mode: "create" | "edit";
  initialValues: CourseEditorValues;
  onSubmit: (values: CourseEditorValues) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submitPendingLabel: string;
  onCancel?: () => void;
}

const statusOptions: Array<{ value: CourseStatus; label: string; description: string }> = [
  { value: "draft", label: "Draft", description: "Keep it private while you build." },
  {
    value: "pending_review",
    label: "Pending review",
    description: "Ready for a final pass before publishing.",
  },
  { value: "published", label: "Published", description: "Visible to learners right away." },
];

export function CourseEditorForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submitPendingLabel,
  onCancel,
}: CourseEditorFormProps) {
  const [values, setValues] = useState<CourseEditorValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const previewInitials = useMemo(() => {
    const words = values.title.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "CR";
    return words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");
  }, [values.title]);

  function handleChange<K extends keyof CourseEditorValues>(key: K, nextValue: CourseEditorValues[K]) {
    setValues((prev) => ({ ...prev, [key]: nextValue }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
      <Card className="shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-muted">
              {mode === "create" ? "New course" : "Edit course"}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-navy-900">
              {mode === "create" ? "Shape the course from the ground up" : "Refine the live course"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-surface-muted">
              Set the headline, pricing, status, and thumbnail before you publish the course to learners.
            </p>
          </div>
          <div className="rounded-full border border-navy-200 bg-surface-canvas px-3 py-1.5 text-xs font-medium text-surface-muted">
            Auto-saved in memory only
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-navy-900">
              Course title
              <input
                required
                value={values.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="e.g. Applied Cyber Defense"
                className="rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-surface-muted focus:border-navy-500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-navy-900">
              Thumbnail URL
              <input
                value={values.thumbnailUrl ?? ""}
                onChange={(event) => handleChange("thumbnailUrl", event.target.value || undefined)}
                placeholder="https://..."
                className="rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-surface-muted focus:border-navy-500"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-navy-900">
            Course description
            <textarea
              required
              rows={5}
              value={values.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Describe what learners will build, practice, or master."
              className="rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-surface-muted focus:border-navy-500"
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-navy-900">
              Price
              <input
                type="number"
                min={0}
                value={values.price}
                onChange={(event) => handleChange("price", Number(event.target.value))}
                className="rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-navy-900">
              Publishing status
              <select
                value={values.status}
                onChange={(event) => handleChange("status", event.target.value as CourseStatus)}
                className="rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-2 rounded-xl border border-dashed border-navy-200 bg-surface-canvas/80 p-4 text-sm text-surface-muted">
            <div className="font-semibold text-navy-900">Publishing checklist</div>
            <p>Use draft while writing, switch to review when the curriculum is ready, then publish.</p>
            <p>{values.price === 0 ? "Free enrollment is enabled." : `Learners will be charged $${values.price.toFixed(2)}.`}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" variant="primary" className="min-w-36" disabled={isSubmitting}>
              {isSubmitting ? submitPendingLabel : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} className="min-w-36">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-muted">Preview</p>
            <h4 className="mt-1 text-lg font-bold text-navy-900">How the course will read</h4>
          </div>
          <span className="rounded-full border border-navy-200 px-3 py-1 text-xs font-medium text-surface-muted">
            {mode === "create" ? "Draft view" : "Editing view"}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-navy-200 bg-lemon-50">
          <div className="flex h-32 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700 text-4xl font-black tracking-[0.2em] text-lemon-500">
            {previewInitials || "CR"}
          </div>
          <div className="space-y-4 p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-surface-muted">
                {statusOptions.find((option) => option.value === values.status)?.label}
              </p>
              <h5 className="mt-1 text-xl font-bold text-navy-900">
                {values.title || "Course title preview"}
              </h5>
            </div>
            <p className="text-sm leading-6 text-navy-700">
              {values.description || "The course description will appear here as you shape the outline and learning goals."}
            </p>
            <div className="grid gap-3 rounded-xl bg-white p-4 text-sm text-surface-muted">
              <div className="flex items-center justify-between">
                <span>Pricing</span>
                <span className="font-medium text-navy-900">{values.price === 0 ? "Free" : `$${values.price.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Thumbnail</span>
                <span className="max-w-[180px] truncate font-medium text-navy-900">
                  {values.thumbnailUrl || "Not set"}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-navy-200 bg-white p-4 text-xs text-surface-muted">
              The instructor dashboard will link to this same record for editing and review.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}