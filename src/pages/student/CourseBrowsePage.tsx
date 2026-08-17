interface LibraryCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  lessons: number;
  duration: string;
  thumbnailLabel: string;
}

const libraryCourses: LibraryCourse[] = [
  {
    id: "l1",
    title: "Advanced React Patterns",
    category: "Web Development",
    instructor: "K. Girma",
    lessons: 22,
    duration: "9h 30m",
    thumbnailLabel: "RX",
  },
  {
    id: "l2",
    title: "Statistics for Everyone",
    category: "Mathematics",
    instructor: "Dr. A. Bekele",
    lessons: 16,
    duration: "6h 10m",
    thumbnailLabel: "ST",
  },
  {
    id: "l3",
    title: "Public Speaking Essentials",
    category: "Soft Skills",
    instructor: "M. Alemu",
    lessons: 8,
    duration: "3h 45m",
    thumbnailLabel: "PS",
  },
  {
    id: "l4",
    title: "Database Design Basics",
    category: "Web Development",
    instructor: "T. Wolde",
    lessons: 14,
    duration: "5h 20m",
    thumbnailLabel: "DB",
  },
];

export function CourseBrowsePage() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {libraryCourses.map((course) => (
        <div
          key={course.id}
          className="flex flex-col overflow-hidden rounded-xl border border-navy-200 bg-lemon-50 transition-colors hover:bg-surface-card"
        >
          <div className="flex h-[90px] items-center justify-center bg-navy-900 text-xl font-bold tracking-wide text-lemon-500">
            {course.thumbnailLabel}
          </div>
          <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
            <span className="mb-2 inline-block w-fit rounded-full bg-lemon-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-700">
              {course.category}
            </span>
            <h3 className="mb-1 text-base font-bold text-navy-900">
              {course.title}
            </h3>
            <p className="mb-1 text-[13px] text-navy-900">
              {course.instructor}
            </p>
            <p className="mb-3 text-[13px] text-navy-900">
              {course.lessons} lessons · {course.duration}
            </p>
            <button className="mt-auto w-full rounded-lg border-[1.5px] border-lemon-500 bg-lemon-500 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-lemon-50 active:bg-lemon-700 active:text-white">
              Enroll Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
