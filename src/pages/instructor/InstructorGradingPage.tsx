import { Card } from "../../components/ui/Card";

const gradingItems = [
  { title: "Policy Brief Draft", course: "Data Governance", due: "Today", state: "Needs review" },
  { title: "Quiz 2", course: "Network Fundamentals", due: "Tomorrow", state: "Pending" },
  { title: "Final Project", course: "Cybersecurity Basics", due: "Fri", state: "Published rubric" },
];

export function InstructorGradingPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {gradingItems.map((item) => (
        <Card key={item.title} className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-navy-900">{item.title}</h3>
          <p className="text-sm text-surface-muted">{item.course}</p>
          <p className="text-sm text-navy-700">Due: {item.due}</p>
          <p className="text-sm font-medium text-lemon-700">{item.state}</p>
        </Card>
      ))}
    </div>
  );
}