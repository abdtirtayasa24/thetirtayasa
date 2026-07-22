from pydantic import BaseModel, ConfigDict


class ProjectCompany(BaseModel):
    name: str | None
    disclose_name: bool


class ProjectMetricResponse(BaseModel):
    label: str
    value: str
    public: bool


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    title: str
    company: ProjectCompany
    summary: str
    featured: bool
    status: str
    visibility: str
    year: int
    categories: list[str]
    technologies: list[str]
    deployment: list[str]
    metrics: list[ProjectMetricResponse]
    body: str | None = None
