import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, Boolean, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

from .database import Base


def gen_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: gen_id("user"))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    enrollments = relationship("Enrollment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, default=lambda: gen_id("course"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    instructor_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="draft")  # draft | pending_review | published
    price = Column(Float, nullable=False, default=0)
    thumbnail_url = Column(String, nullable=True)

    modules = relationship("Module", back_populates="course", order_by="Module.position")
    enrollments = relationship("Enrollment", back_populates="course")


class Module(Base):
    __tablename__ = "modules"

    id = Column(String, primary_key=True, default=lambda: gen_id("module"))
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    position = Column(Integer, nullable=False, default=0)
    is_free = Column(Boolean, nullable=False, default=False)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, default=lambda: gen_id("lesson"))
    module_id = Column(String, ForeignKey("modules.id"), nullable=False)
    type = Column(String, nullable=False, default="video")  # video | text
    content_url = Column(String, nullable=False, default="")
    duration_seconds = Column(Integer, nullable=True)

    module = relationship("Module", back_populates="lessons")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(String, primary_key=True, default=lambda: gen_id("enr"))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), default=utcnow)
    completion_pct = Column(Float, nullable=False, default=0)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: gen_id("notif"))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # deadline | grade | announcement | new_content
    message = Column(String, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="notifications")
