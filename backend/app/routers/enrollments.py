from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


def _ensure_self_or_admin(requested_user_id: str, current_user: models.User):
    if current_user.id != requested_user_id and current_user.role not in ("super_admin", "institution_admin", "corporate_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's enrollments")


@router.get("", response_model=List[schemas.EnrollmentOut])
def list_enrollments(
    userId: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    _ensure_self_or_admin(userId, current_user)
    return db.query(models.Enrollment).filter(models.Enrollment.user_id == userId).all()


@router.post("", response_model=schemas.EnrollmentOut, status_code=status.HTTP_201_CREATED)
def create_enrollment(
    payload: schemas.EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    _ensure_self_or_admin(payload.user_id, current_user)

    course = db.query(models.Course).filter(models.Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    existing = (
        db.query(models.Enrollment)
        .filter(models.Enrollment.user_id == payload.user_id, models.Enrollment.course_id == payload.course_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already enrolled in this course")

    enrollment = models.Enrollment(user_id=payload.user_id, course_id=payload.course_id, completion_pct=0)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.patch("/{enrollment_id}", response_model=schemas.EnrollmentOut)
def update_enrollment(
    enrollment_id: str,
    payload: schemas.EnrollmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found")

    _ensure_self_or_admin(enrollment.user_id, current_user)

    enrollment.completion_pct = payload.completion_pct
    db.commit()
    db.refresh(enrollment)
    return enrollment
