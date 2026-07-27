import { Card } from "../../components/ui/Card";

const learners = [
  { name: "Amina Hassan", course: "Intro to Data Governance", progress: 84, status: "On track" },
  { name: "Tsehay Mekonnen", course: "Network Fundamentals", progress: 61, status: "Needs follow-up" },
  { name: "Yonatan Tesfaye", course: "Intro to Data Governance", progress: 28, status: "Just started" },
];

export function InstructorLearnersPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {learners.map((learner) => (
        <Card key={learner.name} className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-bold text-navy-900">{learner.name}</h3>
            <p className="mt-1 text-sm text-surface-muted">{learner.course}</p>
          </div>
          <div className="text-sm text-navy-700">Progress: {learner.progress}%</div>
          <div className="text-sm font-medium text-lemon-700">{learner.status}</div>
        </Card>
      ))}
    </div>
  );
}