from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[schemas.NotificationOut])
def list_notifications(
    userId: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if current_user.id != userId and current_user.role not in ("super_admin", "institution_admin", "corporate_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's notifications")
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == userId)
        .order_by(models.Notification.created_at.desc())
        .all()
    )
