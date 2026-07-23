# Deployment

Deployment target split:

- Frontend: Ubuntu 24.04 VPS serving `thetirtayasa.my.id` with Next.js standalone, systemd, and Nginx.
- Backend: FastAPI Cloud. The frontend points to that backend with `NEXT_PUBLIC_BACKEND_API_URL` at build time.

## Files

- `systemd/portfolio-nextjs.service` — Next.js standalone frontend on `127.0.0.1:3030`.
- `nginx/thetirtayasa.my.id.conf` — frontend-only Nginx reverse proxy, TLS paths, and public request rate limits.
- `scripts/deploy-frontend.sh` — build and switch frontend release.
- `scripts/rollback-frontend.sh` — switch frontend symlink to a previous release.
- `scripts/smoke-test.sh` — production smoke checks for the frontend domain and separate FastAPI Cloud backend URL.
- `RUNBOOK.md` — deploy, rollback, logs, Nginx, HTTPS, AI unavailable, backend ingestion, and smoke operations.

## Secrets

Do not commit production secrets. Backend secrets belong in FastAPI Cloud platform secrets, not on the frontend VPS and not in browser-visible frontend variables.

## Frontend runtime

The frontend deployment intentionally uses native Node/systemd with Next.js standalone output. Do not add Docker for frontend deployment unless the deployment architecture is explicitly changed.

Before building the frontend release, configure only public frontend variables such as:

```bash
NEXT_PUBLIC_BACKEND_API_URL=https://<fastapi-cloud-backend-origin>
```
