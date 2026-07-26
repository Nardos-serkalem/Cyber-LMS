from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("", response_model=List[schemas.CourseOut])
def list_courses(db: Session = Depends(get_db)):
    # Student "Browse" and "Dashboard" both use this. Only published courses
    # are shown to learners; instructors see their own drafts via a separate
    # instructor endpoint (not part of this handoff yet).
    return db.query(models.Course).filter(models.Course.status == "published").all()


@router.get("/{course_id}/modules", response_model=List[schemas.ModuleOut])
def list_course_modules(course_id: str, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return (
        db.query(models.Module)
        .filter(models.Module.course_id == course_id)
        .order_by(models.Module.position)
        .all()
    )
