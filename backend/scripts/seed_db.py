"""Reset and re-seed the PostgreSQL database with demo data."""

from app.database import Base, SessionLocal, engine
from app.models import (
    Course,
    Enrollment,
    Lesson,
    Module,
    Notification,
    QuizAttempt,
    User,
)
from app.seed import seed_database


def main() -> None:
    print("Dropping all tables…")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables…")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding demo data…")
        seed_database(db)
        counts = {
            "users": db.query(User).count(),
            "courses": db.query(Course).count(),
            "modules": db.query(Module).count(),
            "lessons": db.query(Lesson).count(),
            "enrollments": db.query(Enrollment).count(),
            "notifications": db.query(Notification).count(),
            "quiz_attempts": db.query(QuizAttempt).count(),
        }
        print("Done. Row counts:", counts)
    finally:
        db.close()


if __name__ == "__main__":
    main()
