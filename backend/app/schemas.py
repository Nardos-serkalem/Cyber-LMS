from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


def to_camel(string: str) -> str:
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


# Auth
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(alias="fullName")
    role: Literal["student", "instructor"] = "student"

    model_config = ConfigDict(populate_by_name=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(CamelModel):
    id: str
    email: str
    role: str
    full_name: str
    created_at: datetime


# Courses
CourseStatus = Literal["draft", "pending_review", "published"]


class CourseCreate(BaseModel):
    title: str
    description: str
    status: CourseStatus = "draft"
    price: float = 0
    thumbnail_url: str | None = Field(default=None, alias="thumbnailUrl")
    modules: list["ModuleCreateInline"] = []

    model_config = ConfigDict(populate_by_name=True)


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    thumbnail_url: str | None = Field(default=None, alias="thumbnailUrl")

    model_config = ConfigDict(populate_by_name=True)


class CourseOut(CamelModel):
    id: str
    title: str
    description: str
    instructor_id: str
    status: CourseStatus
    price: float
    thumbnail_url: str | None = None


# Modules
class ModuleCreateInline(BaseModel):
    title: str
    is_free: bool = Field(default=False, alias="isFree")

    model_config = ConfigDict(populate_by_name=True)


class ModuleCreate(BaseModel):
    title: str
    position: int | None = None
    is_free: bool = Field(default=False, alias="isFree")

    model_config = ConfigDict(populate_by_name=True)


class ModuleUpdate(BaseModel):
    title: str | None = None
    position: int | None = None
    is_free: bool | None = Field(default=None, alias="isFree")

    model_config = ConfigDict(populate_by_name=True)


class ModuleOut(CamelModel):
    id: str
    course_id: str
    title: str
    position: int
    is_free: bool


# Lessons
LessonType = Literal["video", "text"]


class LessonCreate(BaseModel):
    title: str
    type: LessonType
    content_url: str = Field(default="", alias="contentUrl")
    duration_seconds: int | None = Field(default=None, alias="durationSeconds")

    model_config = ConfigDict(populate_by_name=True)


class LessonUpdate(BaseModel):
    title: str | None = None
    type: LessonType | None = None
    content_url: str | None = Field(default=None, alias="contentUrl")
    duration_seconds: int | None = Field(default=None, alias="durationSeconds")

    model_config = ConfigDict(populate_by_name=True)


class LessonOut(CamelModel):
    id: str
    module_id: str
    title: str
    type: LessonType
    content_url: str
    duration_seconds: int | None = None


# Enrollments & notifications
class EnrollmentOut(CamelModel):
    id: str
    user_id: str
    course_id: str
    enrolled_at: datetime
    completion_pct: float


class NotificationOut(CamelModel):
    id: str
    user_id: str
    type: str
    message: str
    is_read: bool
    created_at: datetime


# Instructor analytics & grading
class CourseAnalytics(CamelModel):
    course_id: str
    enrollment_count: int
    average_completion_pct: float
    completed_count: int
    in_progress_count: int


class QuizAttemptOut(CamelModel):
    id: str
    user_id: str
    quiz_id: str
    course_id: str
    score: float
    started_at: datetime
    submitted_at: datetime | None = None


class QuizAttemptGrade(BaseModel):
    score: float
