from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Enrollment, Notification, User
from app.schemas import EnrollmentOut, NotificationOut

router = APIRouter(tags=["student"])


@router.get("/enrollments", response_model=list[EnrollmentOut])
def list_enrollments(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    user_id: str | None = None,
):
    target_id = user_id or user.id
    if target_id != user.id and user.role not in {"instructor", "super_admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return db.query(Enrollment).filter(Enrollment.user_id == target_id).all()


@router.get("/notifications", response_model=list[NotificationOut])
def list_notifications(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    user_id: str | None = None,
):
    target_id = user_id or user.id
    if target_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return (
        db.query(Notification)
        .filter(Notification.user_id == target_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
