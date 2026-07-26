from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict

UserRole = Literal["student", "instructor", "institution_admin", "corporate_admin", "super_admin"]
CourseStatus = Literal["draft", "pending_review", "published"]
LessonType = Literal["video", "text"]
NotificationType = Literal["deadline", "grade", "announcement", "new_content"]


def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


# ---------- Auth ----------

class RegisterRequest(CamelModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = "student"


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class UserOut(CamelModel):
    id: str
    email: str
    role: UserRole
    full_name: str
    created_at: datetime


class AuthResponse(CamelModel):
    token: str
    user: UserOut


# ---------- Courses ----------

class CourseOut(CamelModel):
    id: str
    title: str
    description: str
    instructor_id: str
    status: CourseStatus
    price: float
    thumbnail_url: Optional[str] = None


# ---------- Modules / Lessons ----------

class ModuleOut(CamelModel):
    id: str
    course_id: str
    title: str
    position: int
    is_free: bool


class LessonOut(CamelModel):
    id: str
    module_id: str
    type: LessonType
    content_url: str
    duration_seconds: Optional[int] = None


# ---------- Enrollments ----------

class EnrollmentCreate(CamelModel):
    user_id: str
    course_id: str


class EnrollmentUpdate(CamelModel):
    completion_pct: float = Field(ge=0, le=100)


class EnrollmentOut(CamelModel):
    id: str
    user_id: str
    course_id: str
    enrolled_at: datetime
    completion_pct: float


# ---------- Notifications ----------

class NotificationOut(CamelModel):
    id: str
    user_id: str
    type: NotificationType
    message: str
    is_read: bool
    created_at: datetime
