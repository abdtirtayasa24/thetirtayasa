from pydantic import BaseModel, EmailStr, Field


class ContactSubmissionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=10, max_length=4000)
    engagement_type: str | None = Field(default=None, max_length=120)


class ContactSubmissionResponse(BaseModel):
    id: str
    status: str = "received"
