"""Create the app database (if needed), tables, and seed demo data."""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import urlparse

# Allow running as: python scripts/setup_local_db.py
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from app.config import DATABASE_URL
from app.database import Base, SessionLocal, engine
from app.models import (
    Course,
    Enrollment,
    Lesson,
    Module,
    Notification,
    QuizAttempt,
    User,
)
from app.seed import seed_database


def parse_db_url(url: str) -> dict[str, str | int]:
    parsed = urlparse(url.replace("+psycopg2", ""))
    return {
        "user": parsed.username or "postgres",
        "password": parsed.password or "",
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 5432,
        "dbname": (parsed.path or "/postgres").lstrip("/"),
    }


def ensure_database_exists() -> None:
    cfg = parse_db_url(DATABASE_URL)
    db_name = cfg["dbname"]
    admin_db = "postgres"

    print(f"Connecting to PostgreSQL at {cfg['host']}:{cfg['port']} as {cfg['user']}…")
    conn = psycopg2.connect(
        host=cfg["host"],
        port=cfg["port"],
        user=cfg["user"],
        password=cfg["password"],
        dbname=admin_db,
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
    if cur.fetchone():
        print(f"Database '{db_name}' already exists.")
    else:
        print(f"Creating database '{db_name}'…")
        cur.execute(f'CREATE DATABASE "{db_name}"')
        print("Database created.")
    cur.close()
    conn.close()


def setup(reset: bool = False) -> None:
    ensure_database_exists()

    if reset:
        print("Dropping all tables…")
        Base.metadata.drop_all(bind=engine)

    print("Creating tables…")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding demo data…")
        seed_database(db)
        counts = {
            "users": db.query(User).count(),
            "courses": db.query(Course).count(),
            "modules": db.query(Module).count(),
            "lessons": db.query(Lesson).count(),
            "enrollments": db.query(Enrollment).count(),
            "notifications": db.query(Notification).count(),
            "quiz_attempts": db.query(QuizAttempt).count(),
        }
        print("Done. Row counts:", counts)
    finally:
        db.close()


if __name__ == "__main__":
    reset_flag = "--reset" in sys.argv
    try:
        setup(reset=reset_flag)
    except psycopg2.OperationalError as exc:
        print("\nCould not connect to PostgreSQL.")
        print("Update DATABASE_URL in backend/.env with your local username and password.")
        print(f"Error: {exc}")
        sys.exit(1)
