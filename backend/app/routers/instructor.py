from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_instructor
from app.database import get_db
from app.models import Course, Enrollment, QuizAttempt, User
from app.schemas import CourseAnalytics, CourseOut, EnrollmentOut, QuizAttemptGrade, QuizAttemptOut

router = APIRouter(prefix="/instructor", tags=["instructor"])


@router.get("/courses", response_model=list[CourseOut])
def list_instructor_courses(
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    return (
        db.query(Course)
        .filter(Course.instructor_id == instructor.id)
        .order_by(Course.title)
        .all()
    )


@router.get("/courses/{course_id}/enrollments", response_model=list[EnrollmentOut])
def list_course_enrollments(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your course")
    return db.query(Enrollment).filter(Enrollment.course_id == course_id).all()


@router.get("/courses/{course_id}/analytics", response_model=CourseAnalytics)
def course_analytics(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your course")

    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    count = len(enrollments)
    if count == 0:
        return CourseAnalytics(
            course_id=course_id,
            enrollment_count=0,
            average_completion_pct=0,
            completed_count=0,
            in_progress_count=0,
        )

    avg = sum(e.completion_pct for e in enrollments) / count
    completed = sum(1 for e in enrollments if e.completion_pct >= 100)
    return CourseAnalytics(
        course_id=course_id,
        enrollment_count=count,
        average_completion_pct=round(avg, 1),
        completed_count=completed,
        in_progress_count=count - completed,
    )


@router.get("/quiz-attempts", response_model=list[QuizAttemptOut])
def list_quiz_attempts(
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
    course_id: str | None = None,
):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == instructor.id).all()]
    query = db.query(QuizAttempt).filter(QuizAttempt.course_id.in_(course_ids))
    if course_id:
        if course_id not in course_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your course")
        query = query.filter(QuizAttempt.course_id == course_id)
    return query.order_by(QuizAttempt.started_at.desc()).all()


@router.patch("/quiz-attempts/{attempt_id}", response_model=QuizAttemptOut)
def grade_quiz_attempt(
    attempt_id: str,
    body: QuizAttemptGrade,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    attempt = db.get(QuizAttempt, attempt_id)
    if not attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")

    course = db.get(Course, attempt.course_id)
    if not course or course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your quiz attempt")

    attempt.score = body.score
    if attempt.submitted_at is None:
        from datetime import datetime

        attempt.submitted_at = datetime.utcnow()
    db.commit()
    db.refresh(attempt)
    return attempt
