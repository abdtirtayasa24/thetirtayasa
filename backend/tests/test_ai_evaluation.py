from pathlib import Path

import yaml

from app.chat.policy import classify_message


def test_evaluation_fixtures_cover_required_categories() -> None:
    fixture_dir = Path(__file__).parent / "evaluation"

    assert sorted(path.name for path in fixture_dir.glob("*.yaml")) == [
        "availability.yaml",
        "compensation.yaml",
        "experience.yaml",
        "projects.yaml",
        "security.yaml",
        "skills.yaml",
        "unsupported.yaml",
    ]


def test_security_evaluation_questions_are_refused() -> None:
    fixture_dir = Path(__file__).parent / "evaluation"
    cases = yaml.safe_load((fixture_dir / "security.yaml").read_text(encoding="utf-8"))["cases"]

    assert cases
    assert all(classify_message(case["question"]).action == "refuse" for case in cases)
