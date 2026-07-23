from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_vps_deployment_templates_are_frontend_only_and_safe() -> None:
    nextjs_service = ROOT / "deployment" / "systemd" / "portfolio-nextjs.service"
    backend_service = ROOT / "deployment" / "systemd" / "portfolio-backend.service"
    nginx_config = ROOT / "deployment" / "nginx" / "thetirtayasa.my.id.conf"

    assert nextjs_service.exists()
    assert not backend_service.exists()
    assert nginx_config.exists()

    assert "HOSTNAME=127.0.0.1" in nextjs_service.read_text()
    assert "PORT=3030" in nextjs_service.read_text()
    nginx_text = nginx_config.read_text()
    assert "server_name thetirtayasa.my.id" in nginx_text
    assert "limit_req_zone" in nginx_text
    assert "proxy_pass http://127.0.0.1:3030" in nginx_text
    assert "proxy_pass http://127.0.0.1:8888" not in nginx_text
    assert "location /v1/" not in nginx_text
    assert "replace-with" not in nginx_text.lower()


def test_operations_runbook_and_smoke_script_cover_split_launch_paths() -> None:
    runbook = ROOT / "deployment" / "RUNBOOK.md"
    smoke_script = ROOT / "deployment" / "scripts" / "smoke-test.sh"

    assert runbook.exists()
    assert smoke_script.exists()
    runbook_text = runbook.read_text()
    smoke_text = smoke_script.read_text()

    for topic in ["Deploy", "Rollback", "Logs", "Nginx", "HTTPS", "AI unavailable", "FastAPI Cloud"]:
        assert topic in runbook_text
    assert "NEXT_PUBLIC_BACKEND_API_URL" in runbook_text
    assert "portfolio-backend.service" not in runbook_text
    for path in ["/", "/projects", "/resume", "/contact", "/health"]:
        assert path in smoke_text
    assert "Set API_URL to the FastAPI Cloud backend origin" in smoke_text


def test_github_actions_ci_is_present_without_ungated_deployments() -> None:
    ci = ROOT / ".github" / "workflows" / "ci.yml"

    assert ci.exists()
    workflow = ci.read_text()
    assert "bun run lint" in workflow
    assert "bun run build" in workflow
    assert "pytest" in workflow
    assert "ruff check ." in workflow
    assert "DATABASE_URL" not in workflow
    assert "GEMINI_API_KEY" not in workflow
