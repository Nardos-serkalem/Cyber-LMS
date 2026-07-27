import { Card } from "../../components/ui/Card";

const analytics = [
  { label: "Enrollment growth", value: "+18%" },
  { label: "Average completion", value: "72%" },
  { label: "Published courses", value: "2" },
];

export function InstructorAnalyticsPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {analytics.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-surface-muted">{item.label}</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}