from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import new_id, require_instructor
from app.database import get_db
from app.models import Course, Module, User
from app.schemas import ModuleCreate, ModuleOut, ModuleUpdate

router = APIRouter(tags=["modules"])


def _get_owned_module(db: Session, module_id: str, instructor: User) -> Module:
    module = db.get(Module, module_id)
    if not module:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    course = db.get(Course, module.course_id)
    if not course or course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your module")
    return module


@router.get("/courses/{course_id}/modules", response_model=list[ModuleOut])
def list_modules(course_id: str, db: Annotated[Session, Depends(get_db)]):
    return (
        db.query(Module)
        .filter(Module.course_id == course_id)
        .order_by(Module.position)
        .all()
    )


@router.post("/courses/{course_id}/modules", response_model=ModuleOut, status_code=status.HTTP_201_CREATED)
def create_module(
    course_id: str,
    body: ModuleCreate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your course")

    position = body.position
    if position is None:
        max_pos = db.query(Module).filter(Module.course_id == course_id).count()
        position = max_pos + 1

    module = Module(
        id=new_id("mod"),
        course_id=course_id,
        title=body.title,
        position=position,
        is_free=body.is_free,
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.patch("/modules/{module_id}", response_model=ModuleOut)
def update_module(
    module_id: str,
    body: ModuleUpdate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    module = _get_owned_module(db, module_id, instructor)
    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(module, key, value)
    db.commit()
    db.refresh(module)
    return module


@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_module(
    module_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    module = _get_owned_module(db, module_id, instructor)
    db.delete(module)
    db.commit()
