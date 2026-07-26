import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import Base, engine
from . import models  # noqa: F401 (ensures models are registered before create_all)
from .routers import auth, courses, modules, lessons, enrollments, notifications

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Birana LMS API", version="0.1.0")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(modules.router)
app.include_router(lessons.router)
app.include_router(enrollments.router)
app.include_router(notifications.router)


@app.get("/health")
def health():
    return {"status": "ok"}
