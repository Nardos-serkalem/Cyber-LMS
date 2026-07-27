# CyberZeb LMS — FastAPI Backend

Uses **PostgreSQL on your local PC** (no Docker).

## 1. Configure your local PostgreSQL

Edit `backend/.env` with your PostgreSQL username and password:

```
DATABASE_URL=postgresql+psycopg2://YOUR_USER:YOUR_PASSWORD@localhost:5432/cyberzeb_lms
```

PostgreSQL must be running locally (you have `postgresql-x64-18`).

## 2. Install Python dependencies

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## 3. Create database, tables, and seed test data

```bash
.venv\Scripts\python scripts/setup_local_db.py
```

Use `--reset` to wipe and re-seed:

```bash
.venv\Scripts\python scripts/setup_local_db.py --reset
```

## 4. Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

- API: http://127.0.0.1:8000/docs

## Demo accounts (password: `password123`)

| Email | Role |
|-------|------|
| student@example.com | student |
| student2@example.com | student |
| student3@example.com | student |
| instructor@example.com | instructor |
| instructor2@example.com | instructor |

## Seeded test data

- 5 courses (3 published, 1 draft, 1 pending review)
- 7 modules, 8 lessons
- 3 students, 2 instructors
- 6 enrollments, 4 notifications, 4 quiz attempts
