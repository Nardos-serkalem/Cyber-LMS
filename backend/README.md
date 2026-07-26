# Birana LMS — Backend (Student Workflow)

FastAPI + SQLAlchemy backend implementing the endpoints from the frontend handoff doc.
Response fields are camelCase and match `src/types/index.ts` in the frontend exactly, so
the frontend `lib/api/*.ts` files can be swapped from mock data to real `fetch` calls with
no shape changes needed.

## Endpoints implemented

| Step | Endpoint | Auth |
|---|---|---|
| Register | `POST /auth/register` | — |
| Login | `POST /auth/login` | — |
| Dashboard | `GET /enrollments?userId=` | Bearer token |
| Dashboard | `GET /courses` | — |
| Dashboard | `GET /notifications?userId=` | Bearer token |
| Browse | `GET /courses` | — |
| Enroll | `POST /enrollments` | Bearer token |
| Course detail | `GET /courses/:id/modules` | — |
| Course detail | `GET /modules/:id/lessons` | — |
| Lesson player | `GET /lessons/:id` | — |
| Mark complete | `PATCH /enrollments/:id` | Bearer token |

Quiz and certificate endpoints are intentionally **not** included yet — matches the "not
built on frontend yet" note in the handoff.

`GET /enrollments` and `GET /notifications` require a Bearer token and only let a user read
their own data (or an admin role read anyone's) — this exists so "Mark complete" and "Enroll"
can't be spoofed for another user's account once the frontend wires up real auth headers.

## Quick start (Ubuntu)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # edit if needed

# Option A — fastest, no Docker: leave DATABASE_URL unset/commented out in .env
# and the app falls back to a local SQLite file (birana_lms.db) automatically.

# Option B — Postgres (matches the proposal's recommended stack):
docker compose up -d        # starts Postgres on localhost:5432
# then set DATABASE_URL in .env to the postgresql+psycopg2://... line

python -m app.seed          # creates a demo instructor, course, modules,
                             # lessons, a student, and one enrollment/notification
uvicorn app.main:app --reload --port 8000
```

API docs (interactive): http://localhost:8000/docs

Demo accounts after seeding:
- `student@birana.dev` / `password123`
- `instructor@birana.dev` / `password123`

## CORS

`CORS_ORIGINS` in `.env` controls which frontend origins may call the API. Defaults to the
Vite dev server (`http://localhost:5173`). Add your deployed frontend URL here before going
to production.

## Wiring up the frontend

The frontend's `src/lib/api/*.ts` files currently call `mockDelay()` against static arrays
in `mockData/`. To connect to this backend, replace `client.ts`'s `mockDelay` usage with real
`fetch` calls to `http://localhost:8000` (or an `VITE_API_BASE_URL` env var), and pass the
JWT `token` returned from `/auth/login` as an `Authorization: Bearer <token>` header on the
`enrollments` and `notifications` calls. Everything else needed to swap "Enroll" and "Mark
complete" from mocked to real is now live on this backend — no more faking required.

## Notes on the proposal's tech stack

The Cyber-Zeb proposal calls for FastAPI + PostgreSQL + JWT + OAuth2, which this follows.
OAuth (Google) and 2FA (FR-AUTH-01, FR-AUTH-03) aren't implemented in this handoff slice —
only email/password register+login, which is what the frontend's `LoginPage`/`RegisterPage`
currently need. Happy to add those next once the frontend has UI for them.
