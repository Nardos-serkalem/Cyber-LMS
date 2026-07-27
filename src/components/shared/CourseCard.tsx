import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Course } from "../../types";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
}

export function CourseCard({ course, isEnrolled, onEnroll }: CourseCardProps) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <Link to={`/courses/${course.id}`} className="text-sm font-medium text-navy-900 hover:underline">
          {course.title}
        </Link>
        {isEnrolled && <Badge status="enrolled" />}
      </div>
      <p className="mb-3 text-xs text-surface-muted">{course.description}</p>
      <Button
        variant={isEnrolled ? "ghost" : "primary"}
        disabled={isEnrolled}
        onClick={() => onEnroll(course.id)}
        className="w-full"
      >
        {isEnrolled ? "Enrolled" : "Enroll"}
      </Button>
    </Card>
  );
}