# Operations Runbook

This runbook covers the split production deployment:

- Frontend: Ubuntu 24.04 VPS for `thetirtayasa.my.id` using Next.js standalone, systemd, and Nginx.
- Backend: FastAPI Cloud, configured as a separate API origin.

## Deploy

### Backend on FastAPI Cloud

1. Configure platform secrets in FastAPI Cloud:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `INGESTION_SECRET`
   - `RATE_LIMIT_HMAC_SECRET`
   - chat limit and budget settings from `backend/.env.example`
2. Use `/health` as the health check.
3. Deploy the backend through FastAPI Cloud.
4. Record the backend origin. Use it as `API_URL` for smoke tests and `NEXT_PUBLIC_BACKEND_API_URL` for frontend builds.

### Frontend on VPS

1. Pull the reviewed commit onto the VPS.
2. Configure public frontend environment before build:

```bash
export NEXT_PUBLIC_BACKEND_API_URL="https://<fastapi-cloud-backend-origin>"
```

3. Build and switch the frontend release:

```bash
sudo -E deployment/scripts/deploy-frontend.sh
```

4. Reload Nginx after config changes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

5. Run smoke tests with separate frontend and backend origins:

```bash
BASE_URL=https://thetirtayasa.my.id \
API_URL=https://<fastapi-cloud-backend-origin> \
deployment/scripts/smoke-test.sh
```

## Rollback

### Frontend rollback

List previous frontend releases:

```bash
ls -1 /var/www/thetirtayasa/releases
```

Rollback to a known-good frontend release:

```bash
sudo deployment/scripts/rollback-frontend.sh /var/www/thetirtayasa/releases/<release>/frontend
```

### Backend rollback

Rollback the backend through FastAPI Cloud release controls. Do not attempt to run the backend service on the frontend VPS for production.

## Logs

Frontend logs on the VPS:

```bash
sudo journalctl -u portfolio-nextjs.service -f
```

Nginx logs on the VPS:

```bash
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```

Backend logs are viewed in FastAPI Cloud.

## Nginx

Validate and reload Nginx safely:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

The Nginx template proxies only the frontend domain to local Next.js on `127.0.0.1:3030`. Backend API traffic goes directly to FastAPI Cloud through `NEXT_PUBLIC_BACKEND_API_URL`.

## HTTPS

Check certificate status for the frontend domain:

```bash
sudo certbot certificates
sudo systemctl list-timers | grep certbot
```

Dry-run renewal:

```bash
sudo certbot renew --dry-run
```

## AI unavailable

If Gemini, Supabase, FastAPI Cloud, or budget controls make AI unavailable, the frontend portfolio should remain usable. Verify:

- public pages still load on `https://thetirtayasa.my.id`
- `/contact` still loads on the frontend domain
- `$API_URL/v1/chat` returns either `token` or machine-readable `error` SSE events
- frontend displays the chat unavailable state without blocking navigation

## Ingestion after content changes

Rerun ingestion against the FastAPI Cloud backend after changing public content that should be available to Tirtayasa AI:

```bash
curl -X POST https://<fastapi-cloud-backend-origin>/internal/ingestion/sync \
  -H "x-ingestion-secret: <backend-only-secret>"
```

Do not paste secrets into shell history on shared machines.
