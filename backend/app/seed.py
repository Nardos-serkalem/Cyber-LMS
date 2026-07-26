"""
Populate the database with a demo instructor, a published course, two
modules, and a few lessons — enough for the student pages to have real
data to hit instead of empty arrays.

Run with:  python -m app.seed
"""
from .database import Base, engine, SessionLocal
from . import models, auth

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    instructor = db.query(models.User).filter(models.User.email == "instructor@birana.dev").first()
    if not instructor:
        instructor = models.User(
            email="instructor@birana.dev",
            password_hash=auth.hash_password("password123"),
            role="instructor",
            full_name="Selam Tesfaye",
        )
        db.add(instructor)
        db.commit()
        db.refresh(instructor)
        print(f"Created instructor: {instructor.email} / password123")

    course = db.query(models.Course).filter(models.Course.title == "Intro to Cybersecurity").first()
    if not course:
        course = models.Course(
            title="Intro to Cybersecurity",
            description="Foundations of cybersecurity: threats, defenses, and best practices.",
            instructor_id=instructor.id,
            status="published",
            price=0,
        )
        db.add(course)
        db.commit()
        db.refresh(course)

        m1 = models.Module(course_id=course.id, title="Getting Started", position=1, is_free=True)
        m2 = models.Module(course_id=course.id, title="Core Concepts", position=2, is_free=False)
        db.add_all([m1, m2])
        db.commit()
        db.refresh(m1)
        db.refresh(m2)

        db.add_all([
            models.Lesson(module_id=m1.id, type="video", content_url="https://example.com/lessons/welcome.mp4", duration_seconds=300),
            models.Lesson(module_id=m1.id, type="text", content_url="https://example.com/lessons/setup.md"),
            models.Lesson(module_id=m2.id, type="video", content_url="https://example.com/lessons/threats.mp4", duration_seconds=600),
        ])
        db.commit()
        print(f"Created course '{course.title}' with 2 modules and 3 lessons")

    student = db.query(models.User).filter(models.User.email == "student@birana.dev").first()
    if not student:
        student = models.User(
            email="student@birana.dev",
            password_hash=auth.hash_password("password123"),
            role="student",
            full_name="Yonatan Shitaye",
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        print(f"Created student: {student.email} / password123")

    existing_enrollment = (
        db.query(models.Enrollment)
        .filter(models.Enrollment.user_id == student.id, models.Enrollment.course_id == course.id)
        .first()
    )
    if not existing_enrollment:
        db.add(models.Enrollment(user_id=student.id, course_id=course.id, completion_pct=25))
        db.commit()
        print("Enrolled demo student in demo course at 25% completion")

    existing_notif = db.query(models.Notification).filter(models.Notification.user_id == student.id).first()
    if not existing_notif:
        db.add(models.Notification(
            user_id=student.id,
            type="announcement",
            message="Welcome to Intro to Cybersecurity! New lessons are live.",
        ))
        db.commit()
        print("Seeded a demo notification")

    print("Seed complete.")
finally:
    db.close()
