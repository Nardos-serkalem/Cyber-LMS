from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import (
    Course,
    Enrollment,
    Lesson,
    Module,
    Notification,
    QuizAttempt,
    User,
)


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    now = datetime.utcnow()
    password = hash_password("password123")

    users = [
        User(
            id="instructor-1",
            email="instructor@example.com",
            hashed_password=password,
            role="instructor",
            full_name="Dr. A. Bekele",
            created_at=now,
        ),
        User(
            id="instructor-2",
            email="instructor2@example.com",
            hashed_password=password,
            role="instructor",
            full_name="S. Tesfaye",
            created_at=now,
        ),
        User(
            id="user-1",
            email="student@example.com",
            hashed_password=password,
            role="student",
            full_name="Yonatan Shitaye",
            created_at=now,
        ),
        User(
            id="user-2",
            email="student2@example.com",
            hashed_password=password,
            role="student",
            full_name="Meron Alemu",
            created_at=now,
        ),
        User(
            id="user-3",
            email="student3@example.com",
            hashed_password=password,
            role="student",
            full_name="Daniel Girma",
            created_at=now,
        ),
    ]
    db.add_all(users)
    db.flush()

    courses = [
        Course(
            id="course-1",
            title="Intro to Data Governance",
            description="Foundations of data governance, ownership, and stewardship.",
            instructor_id="instructor-1",
            status="published",
            price=0,
        ),
        Course(
            id="course-2",
            title="Cybersecurity Basics",
            description="Core concepts in cybersecurity for non-specialists.",
            instructor_id="instructor-2",
            status="published",
            price=0,
        ),
        Course(
            id="course-3",
            title="Network Fundamentals",
            description="How networks move data, from cables to protocols.",
            instructor_id="instructor-1",
            status="published",
            price=0,
        ),
        Course(
            id="course-4",
            title="Cloud Security Essentials",
            description="Draft course covering IAM, encryption, and shared responsibility.",
            instructor_id="instructor-1",
            status="draft",
            price=49,
        ),
        Course(
            id="course-5",
            title="Incident Response Workshop",
            description="Hands-on incident response workflows awaiting review.",
            instructor_id="instructor-1",
            status="pending_review",
            price=79,
        ),
    ]
    db.add_all(courses)

    modules = [
        Module(id="mod-1", course_id="course-1", title="Foundations", position=1, is_free=True),
        Module(id="mod-2", course_id="course-1", title="Data Stewardship", position=2, is_free=False),
        Module(id="mod-3", course_id="course-2", title="Threats & Attack Vectors", position=1, is_free=True),
        Module(id="mod-4", course_id="course-2", title="Defensive Controls", position=2, is_free=False),
        Module(id="mod-5", course_id="course-3", title="OSI Model", position=1, is_free=True),
        Module(id="mod-6", course_id="course-4", title="Cloud Identity", position=1, is_free=True),
        Module(id="mod-7", course_id="course-5", title="Triage Playbooks", position=1, is_free=False),
    ]
    db.add_all(modules)

    lessons = [
        Lesson(
            id="lesson-1",
            module_id="mod-1",
            title="What is data governance?",
            type="video",
            content_url="https://example.com/videos/governance-intro",
            duration_seconds=420,
        ),
        Lesson(
            id="lesson-2",
            module_id="mod-1",
            title="Key roles and responsibilities",
            type="text",
            content_url="https://example.com/docs/governance-roles",
        ),
        Lesson(
            id="lesson-3",
            module_id="mod-2",
            title="Building a stewardship plan",
            type="video",
            content_url="https://example.com/videos/stewardship-plan",
            duration_seconds=600,
        ),
        Lesson(
            id="lesson-4",
            module_id="mod-3",
            title="Common attack vectors",
            type="video",
            content_url="https://example.com/videos/attack-vectors",
            duration_seconds=360,
        ),
        Lesson(
            id="lesson-5",
            module_id="mod-4",
            title="Firewalls and segmentation",
            type="text",
            content_url="https://example.com/docs/firewalls",
        ),
        Lesson(
            id="lesson-6",
            module_id="mod-5",
            title="Layers 1–3 explained",
            type="video",
            content_url="https://example.com/videos/osi-layers",
            duration_seconds=540,
        ),
        Lesson(
            id="lesson-7",
            module_id="mod-6",
            title="IAM best practices",
            type="text",
            content_url="https://example.com/docs/cloud-iam",
        ),
        Lesson(
            id="lesson-8",
            module_id="mod-7",
            title="First 30 minutes of an incident",
            type="video",
            content_url="https://example.com/videos/incident-triage",
            duration_seconds=480,
        ),
    ]
    db.add_all(lessons)

    enrollments = [
        Enrollment(
            id="enroll-1",
            user_id="user-1",
            course_id="course-1",
            enrolled_at=now - timedelta(days=14),
            completion_pct=45,
        ),
        Enrollment(
            id="enroll-2",
            user_id="user-1",
            course_id="course-2",
            enrolled_at=now - timedelta(days=30),
            completion_pct=100,
        ),
        Enrollment(
            id="enroll-3",
            user_id="user-2",
            course_id="course-1",
            enrolled_at=now - timedelta(days=7),
            completion_pct=20,
        ),
        Enrollment(
            id="enroll-4",
            user_id="user-2",
            course_id="course-3",
            enrolled_at=now - timedelta(days=3),
            completion_pct=65,
        ),
        Enrollment(
            id="enroll-5",
            user_id="user-3",
            course_id="course-2",
            enrolled_at=now - timedelta(days=10),
            completion_pct=80,
        ),
        Enrollment(
            id="enroll-6",
            user_id="user-3",
            course_id="course-3",
            enrolled_at=now - timedelta(days=1),
            completion_pct=10,
        ),
    ]
    db.add_all(enrollments)

    notifications = [
        Notification(
            id="notif-1",
            user_id="user-1",
            type="deadline",
            message="Assignment overdue: Data Stewardship quiz",
            is_read=False,
            created_at=now - timedelta(days=2),
        ),
        Notification(
            id="notif-2",
            user_id="user-1",
            type="grade",
            message="You scored 92% on Cybersecurity Basics final",
            is_read=True,
            created_at=now - timedelta(days=5),
        ),
        Notification(
            id="notif-3",
            user_id="user-2",
            type="announcement",
            message="New lesson added to Intro to Data Governance",
            is_read=False,
            created_at=now - timedelta(days=1),
        ),
        Notification(
            id="notif-4",
            user_id="user-3",
            type="new_content",
            message="Network Fundamentals module 1 is now available",
            is_read=False,
            created_at=now - timedelta(hours=6),
        ),
    ]
    db.add_all(notifications)

    quiz_attempts = [
        QuizAttempt(
            id="attempt-1",
            user_id="user-1",
            quiz_id="quiz-1",
            course_id="course-1",
            score=0,
            started_at=now - timedelta(days=1),
            submitted_at=None,
        ),
        QuizAttempt(
            id="attempt-2",
            user_id="user-1",
            quiz_id="quiz-2",
            course_id="course-2",
            score=92,
            started_at=now - timedelta(days=4),
            submitted_at=now - timedelta(days=4),
        ),
        QuizAttempt(
            id="attempt-3",
            user_id="user-2",
            quiz_id="quiz-3",
            course_id="course-1",
            score=0,
            started_at=now - timedelta(hours=12),
            submitted_at=None,
        ),
        QuizAttempt(
            id="attempt-4",
            user_id="user-3",
            quiz_id="quiz-4",
            course_id="course-2",
            score=74,
            started_at=now - timedelta(days=2),
            submitted_at=now - timedelta(days=2),
        ),
    ]
    db.add_all(quiz_attempts)

    db.commit()
