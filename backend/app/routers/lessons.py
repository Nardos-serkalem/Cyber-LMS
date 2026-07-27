from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import new_id, require_instructor
from app.database import get_db
from app.models import Course, Lesson, Module, User
from app.schemas import LessonCreate, LessonOut, LessonUpdate

router = APIRouter(tags=["lessons"])


def _get_owned_lesson(db: Session, lesson_id: str, instructor: User) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    module = db.get(Module, lesson.module_id)
    if not module:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    course = db.get(Course, module.course_id)
    if not course or course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your lesson")
    return lesson


@router.get("/modules/{module_id}/lessons", response_model=list[LessonOut])
def list_lessons(module_id: str, db: Annotated[Session, Depends(get_db)]):
    return db.query(Lesson).filter(Lesson.module_id == module_id).all()


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: str, db: Annotated[Session, Depends(get_db)]):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson


@router.post("/modules/{module_id}/lessons", response_model=LessonOut, status_code=status.HTTP_201_CREATED)
def create_lesson(
    module_id: str,
    body: LessonCreate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    module = db.get(Module, module_id)
    if not module:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    course = db.get(Course, module.course_id)
    if not course or course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your module")

    lesson = Lesson(
        id=new_id("lesson"),
        module_id=module_id,
        title=body.title,
        type=body.type,
        content_url=body.content_url,
        duration_seconds=body.duration_seconds,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.patch("/lessons/{lesson_id}", response_model=LessonOut)
def update_lesson(
    lesson_id: str,
    body: LessonUpdate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    lesson = _get_owned_lesson(db, lesson_id, instructor)
    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(lesson, key, value)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson(
    lesson_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    lesson = _get_owned_lesson(db, lesson_id, instructor)
    db.delete(lesson)
    db.commit()
