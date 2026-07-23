# Backend

FastAPI backend for The Tirtayasa Portfolio.

## Local run

```bash
cd backend
source .venv/bin/activate
fastapi dev app/main.py --host 127.0.0.1 --port 8888
```

## Health check

```bash
curl http://127.0.0.1:8888/health
```

Expected:

```json
{"status":"ok","service":"Data Analyst & AI Enabler Portfolio API"}
```

## Production environment variables

Configure these outside the repository for VPS/FastAPI Cloud deployments:

- `APP_NAME`
- `APP_ENV`
- `BACKEND_CORS_ORIGINS`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_CHAT_MODEL`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_EMBEDDING_DIMENSIONS`
- `INGESTION_SECRET`
- `RATE_LIMIT_HMAC_SECRET`
- `CHAT_REQUESTS_PER_MINUTE_PER_VISITOR`
- `CHAT_REQUESTS_PER_HOUR_PER_SESSION`
- `CHAT_MAXIMUM_MESSAGE_CHARACTERS`
- `CHAT_MAXIMUM_CONVERSATION_MESSAGES`
- `AI_CHAT_DAILY_REQUEST_LIMIT`
- `AI_CHAT_ENABLED`
- `MAXIMUM_CONTEXT_CHUNKS`

Never expose Supabase service credentials or Gemini keys to frontend/browser code.

## FastAPI Cloud notes

Use `/health` as the deployment health check. Configure Supabase and Gemini credentials as platform secrets. Failed releases should not replace a healthy running version where the platform supports health-gated rollouts.
