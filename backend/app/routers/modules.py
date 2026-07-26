from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/modules", tags=["modules"])


@router.get("/{module_id}/lessons", response_model=List[schemas.LessonOut])
def list_module_lessons(module_id: str, db: Session = Depends(get_db)):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    return db.query(models.Lesson).filter(models.Lesson.module_id == module_id).all()
