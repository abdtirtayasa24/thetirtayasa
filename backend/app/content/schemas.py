from typing import Literal

from pydantic import BaseModel, Field, field_validator

ProjectStatus = Literal["draft", "published", "archived"]
ContentVisibility = Literal["public", "private"]


class ContactContent(BaseModel):
    email: str
    whatsapp_url: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None


class AssistantContent(BaseModel):
    display_name: str = "Tirtayasa AI"


class ProfileContent(BaseModel):
    name: str
    headline: str
    location: str | None = None
    summary: str
    contact: ContactContent
    assistant: AssistantContent = Field(default_factory=AssistantContent)


class SkillGroup(BaseModel):
    name: str
    skills: list[str]


class SkillsContent(BaseModel):
    groups: list[SkillGroup]


class ExperienceItem(BaseModel):
    title: str
    organization: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    summary: str | None = None


class ExperienceContent(BaseModel):
    items: list[ExperienceItem] = Field(default_factory=list)


class AvailabilityContent(BaseModel):
    status: str
    message: str


class CompanyDisclosure(BaseModel):
    name: str | None = None
    disclose_name: bool = False


class ProjectMetric(BaseModel):
    label: str
    value: str
    public: bool = True


class ProjectConfidentiality(BaseModel):
    hide_internal_urls: bool = True
    hide_source_code: bool = True
    hide_customer_data: bool = True
    anonymize_metrics: bool = True


class ProjectFrontMatter(BaseModel):
    id: str
    slug: str
    title: str
    company: CompanyDisclosure = Field(default_factory=CompanyDisclosure)
    summary: str
    featured: bool = False
    status: ProjectStatus = "draft"
    visibility: ContentVisibility = "public"
    year: int
    categories: list[str]
    technologies: list[str]
    deployment: list[str] = Field(default_factory=list)
    metrics: list[ProjectMetric] = Field(default_factory=list)
    confidentiality: ProjectConfidentiality = Field(default_factory=ProjectConfidentiality)

    @field_validator("id", "slug", "title", "summary")
    @classmethod
    def require_non_empty_text(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("must not be empty")
        return stripped

    @field_validator("categories", "technologies")
    @classmethod
    def require_non_empty_list(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("must contain at least one item")
        return value
