from pydantic import BaseModel, Field
from typing import List, Optional

class EducationEntry(BaseModel):
    degree: Optional[str]
    institution: Optional[str]
    date_range: Optional[str]


class ExperienceEntry(BaseModel):
    company: Optional[str]
    role: Optional[str]
    date_range: Optional[str]
    work_done: List[str] = Field(default_factory=list)


class ResumeStructuredOutput(BaseModel):
    skills: List[str]
    education: List[EducationEntry]
    experience: List[ExperienceEntry]
    