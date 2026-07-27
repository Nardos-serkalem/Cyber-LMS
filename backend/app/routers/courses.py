from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user, get_optional_user, new_id, require_instructor
from app.database import get_db
from app.models import Course, Module, User
from app.schemas import CourseCreate, CourseOut, CourseUpdate

router = APIRouter(prefix="/courses", tags=["courses"])


def _get_owned_course(db: Session, course_id: str, instructor: User) -> Course:
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.instructor_id != instructor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your course")
    return course


@router.get("", response_model=list[CourseOut])
def list_published_courses(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User | None, Depends(get_optional_user)],
):
    query = db.query(Course)
    if user and user.role == "instructor":
        return query.filter(Course.instructor_id == user.id).order_by(Course.title).all()
    return query.filter(Course.status == "published").order_by(Course.title).all()


@router.get("/{course_id}", response_model=CourseOut)
def get_course(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User | None, Depends(get_optional_user)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if course.status != "published":
        if not user or (user.role != "instructor" or course.instructor_id != user.id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


@router.post("", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    body: CourseCreate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = Course(
        id=new_id("course"),
        title=body.title,
        description=body.description,
        instructor_id=instructor.id,
        status=body.status,
        price=body.price,
        thumbnail_url=body.thumbnail_url,
    )
    db.add(course)
    db.flush()

    for index, mod in enumerate(body.modules, start=1):
        if not mod.title.strip():
            continue
        db.add(
            Module(
                id=new_id("mod"),
                course_id=course.id,
                title=mod.title.strip(),
                position=index,
                is_free=mod.is_free,
            )
        )

    db.commit()
    db.refresh(course)
    return course


@router.patch("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: str,
    body: CourseUpdate,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = _get_owned_course(db, course_id, instructor)
    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = _get_owned_course(db, course_id, instructor)
    if course.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft courses can be deleted",
        )
    db.delete(course)
    db.commit()


@router.post("/{course_id}/submit", response_model=CourseOut)
def submit_course(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = _get_owned_course(db, course_id, instructor)
    if course.status != "draft":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only draft courses can be submitted")
    course.status = "pending_review"
    db.commit()
    db.refresh(course)
    return course


@router.post("/{course_id}/publish", response_model=CourseOut)
def publish_course(
    course_id: str,
    db: Annotated[Session, Depends(get_db)],
    instructor: Annotated[User, Depends(require_instructor)],
):
    course = _get_owned_course(db, course_id, instructor)
    if course.status not in {"draft", "pending_review"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Course cannot be published")
    course.status = "published"
    db.commit()
    db.refresh(course)
    return course
