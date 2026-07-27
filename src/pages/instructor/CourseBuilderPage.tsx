import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "../../lib/queries/useCreateCourse";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

interface ModuleDraft {
  title: string;
  isFree: boolean;
}

export function CourseBuilderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [modules, setModules] = useState<ModuleDraft[]>([{ title: "", isFree: true }]);
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  function updateModule(index: number, patch: Partial<ModuleDraft>) {
    setModules((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function addModule() {
    setModules((prev) => [...prev, { title: "", isFree: false }]);
  }

  function removeModule(index: number) {
    setModules((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createCourse.mutate(
      {
        title,
        description,
        status: "draft",
        price,
        modules: modules.filter((m) => m.title.trim()),
      },
      { onSuccess: () => navigate("/instructor/dashboard") },
    );
  }

  return (
    <Card className="max-w-xl">
      <div className="mb-5 text-base font-medium text-navy-900">Create a new course</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500"
        />
        <textarea
          required
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500"
        />
        <input
          type="number"
          min={0}
          placeholder="Price (0 for free)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500"
        />

        <div className="mt-2 text-sm font-medium text-navy-700">Modules</div>
        {modules.map((mod, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              placeholder={`Module ${i + 1} title`}
              value={mod.title}
              onChange={(e) => updateModule(i, { title: e.target.value })}
              className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500"
            />
            <label className="flex items-center gap-1 text-xs text-surface-muted">
              <input type="checkbox" checked={mod.isFree} onChange={(e) => updateModule(i, { isFree: e.target.checked })} />
              Free preview
            </label>
            {modules.length > 1 && (
              <button type="button" onClick={() => removeModule(i)} className="text-xs text-danger">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addModule} className="text-left text-xs text-navy-700 hover:underline">
          + Add module
        </button>

        <Button type="submit" variant="primary" className="mt-2 w-full" disabled={createCourse.isPending}>
          {createCourse.isPending ? "Creating…" : "Create course"}
        </Button>
      </form>
    </Card>
  );
}