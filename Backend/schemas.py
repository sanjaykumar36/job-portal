from pydantic import BaseModel


# =====================================================
# USER SCHEMAS
# =====================================================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "candidate"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# =====================================================
# JOB SCHEMAS
# =====================================================

class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    salary: str


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    salary: str
    recruiter_id: int

    class Config:
        from_attributes = True


# =====================================================
# APPLICATION SCHEMAS
# =====================================================

class ApplicationCreate(BaseModel):
    job_id: int
    resume: str | None = None


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    resume: str | None
    status: str

    class Config:
        from_attributes = True

# =====================================================
# RECRUITER APPLICATION RESPONSE
# =====================================================

class RecruiterApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    candidate_name: str
    candidate_email: str
    job_title: str
    resume: str | None
    status: str