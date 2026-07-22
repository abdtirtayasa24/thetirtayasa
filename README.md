# The Tirtayasa Portfolio

Production portfolio for Abdul F. Tirtayasa, a Data Analyst & AI Enabler who delivers data analytics, automation, and AI solutions aligned with business goals.

## Development Environment

### Backend Python environment

Always work inside the repository-local backend virtual environment when running backend commands.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

Do not rely on globally installed Python tools for this repository. Backend tools such as `pytest` and `ruff` are declared in `backend/pyproject.toml` and should be run from `backend/.venv`.

Common commands:

```bash
cd backend
source .venv/bin/activate
pytest
ruff check .
```

### Frontend environment

```bash
cd frontend
npm install
npm run dev -- --hostname 127.0.0.1 --port 3030
```

## Running Locally

Use two terminal sessions so the frontend and backend can run at the same time.

### Terminal 1: backend API

```bash
cd backend
source .venv/bin/activate
fastapi dev app/main.py --host 127.0.0.1 --port 8888
```

Verify the backend health endpoint:

```bash
curl http://127.0.0.1:8888/health
```

Expected response:

```json
{"status":"ok","service":"Data Analyst & AI Enabler Portfolio API"}
```

### Terminal 2: frontend app

```bash
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3030
```

Open the frontend at:

```text
http://127.0.0.1:3030
```

For local frontend-to-backend integration, copy `frontend/.env.example` to `frontend/.env.local` and keep:

```bash
NEXT_PUBLIC_BACKEND_API_URL=http://127.0.0.1:8888
```
