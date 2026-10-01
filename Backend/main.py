
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session
from typing import Literal

import os
import uuid

import crud
import job_crud
import application_crud

from database import engine, Base, SessionLocal
from models import User

from schemas import (
    UserCreate,
    UserResponse,
    JobCreate,
    JobResponse,
    ApplicationCreate,
    ApplicationResponse,
    RecruiterApplicationResponse
)

from crud import create_user

from auth import (
    verify_password,
    create_access_token,
    get_current_user,
    require_role
)

from fastapi.middleware.cors import CORSMiddleware


# =====================================================
# APP
# =====================================================

app = FastAPI(
    title="Job Portal API"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# DATABASE
# =====================================================

Base.metadata.create_all(
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =====================================================
# RESUME STORAGE
# =====================================================

RESUME_FOLDER = "uploads/resumes"

os.makedirs(
    RESUME_FOLDER,
    exist_ok=True
)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Job Portal API is running"
    }


# =====================================================
# REGISTER
# =====================================================

@app.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = crud.getuser_by_email(
        db,
        user.email
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return create_user(
        user,
        db
    )


# =====================================================
# LOGIN
# =====================================================

@app.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = crud.getuser_by_email(
        db,
        email
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
        "sub": str(user.id),
        "role": user.role
    }

    access_token = create_access_token(
        token_data
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =====================================================
# PROFILE
# =====================================================

@app.get("/profile")
def profile(
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Access granted",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# =====================================================
# RECRUITER TEST
# =====================================================

@app.get("/recruiter-test")
def recruiter_test(
    current_user: dict = Depends(
        require_role("recruiter")
    )
):

    return {
        "message": "Recruiter access granted",
        "user_id": current_user["user_id"],
        "role": current_user["role"]
    }


# =====================================================
# USER CRUD
# =====================================================

@app.get(
    "/getall",
    response_model=list[UserResponse]
)
def getall(
    db: Session = Depends(get_db)
):

    return crud.getall(db)


# -----------------------------------------------------
# GET ONE USER
# -----------------------------------------------------

@app.get(
    "/getone/{user_id}",
    response_model=UserResponse
)
def getone(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = crud.getone(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# -----------------------------------------------------
# GET USER BY EMAIL
# -----------------------------------------------------

@app.get(
    "/getuser_by_email/{email}",
    response_model=UserResponse
)
def getuser_by_email(
    email: str,
    db: Session = Depends(get_db)
):

    user = crud.getuser_by_email(
        db,
        email
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# -----------------------------------------------------
# UPDATE USER
# -----------------------------------------------------

@app.put(
    "/update/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    updated_user: UserCreate,
    db: Session = Depends(get_db)
):

    user = crud.update_user(
        db,
        user_id,
        updated_user
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# -----------------------------------------------------
# DELETE USER
# -----------------------------------------------------

@app.delete(
    "/delete/{user_id}",
    response_model=UserResponse
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = crud.delete_user(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# =====================================================
# JOB APIs
# =====================================================

@app.post(
    "/jobs",
    response_model=JobResponse
)
def create_job(
    job: JobCreate,
    current_user: dict = Depends(
        require_role("recruiter")
    ),
    db: Session = Depends(get_db)
):

    return job_crud.create_job(
        db,
        job,
        current_user["user_id"]
    )


# -----------------------------------------------------
# GET ALL JOBS
# -----------------------------------------------------

@app.get(
    "/jobs",
    response_model=list[JobResponse]
)
def get_all_jobs(
    db: Session = Depends(get_db)
):

    return job_crud.get_all_jobs(db)


# -----------------------------------------------------
# GET ONE JOB
# -----------------------------------------------------

@app.get(
    "/jobs/{job_id}",
    response_model=JobResponse
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = job_crud.get_job(
        db,
        job_id
    )

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


# -----------------------------------------------------
# UPDATE JOB
# -----------------------------------------------------

@app.put(
    "/jobs/{job_id}",
    response_model=JobResponse
)
def update_job(
    job_id: int,
    updated_job: JobCreate,
    current_user: dict = Depends(
        require_role("recruiter")
    ),
    db: Session = Depends(get_db)
):

    job = job_crud.get_job(
        db,
        job_id
    )

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if job.recruiter_id != current_user["user_id"]:

        raise HTTPException(
            status_code=403,
            detail="You can only update your own jobs"
        )

    return job_crud.update_job(
        db,
        job_id,
        updated_job
    )


# -----------------------------------------------------
# DELETE JOB
# -----------------------------------------------------

@app.delete(
    "/jobs/{job_id}",
    response_model=JobResponse
)
def delete_job(
    job_id: int,
    current_user: dict = Depends(
        require_role("recruiter")
    ),
    db: Session = Depends(get_db)
):

    job = job_crud.get_job(
        db,
        job_id
    )

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if job.recruiter_id != current_user["user_id"]:

        raise HTTPException(
            status_code=403,
            detail="You can only delete your own jobs"
        )

    return job_crud.delete_job(
        db,
        job_id
    )


# =====================================================
# APPLICATION APIs
# =====================================================

@app.post(
    "/applications",
    response_model=ApplicationResponse
)
def apply_for_job(
    application: ApplicationCreate,
    current_user: dict = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):

    return application_crud.create_application(
        db,
        application,
        current_user["user_id"]
    )


# -----------------------------------------------------
# GET ALL APPLICATIONS
# -----------------------------------------------------

@app.get(
    "/applications",
    response_model=list[ApplicationResponse]
)
def get_all_applications(
    db: Session = Depends(get_db)
):

    return application_crud.get_all_applications(
        db
    )


# -----------------------------------------------------
# RECRUITER APPLICATIONS
# -----------------------------------------------------

@app.get(
    "/recruiter/applications",
    response_model=list[
        RecruiterApplicationResponse
    ]
)
def get_recruiter_applications(
    current_user: dict = Depends(
        require_role("recruiter")
    ),
    db: Session = Depends(get_db)
):

    return application_crud.get_recruiter_applications(
        db,
        current_user["user_id"]
    )


# -----------------------------------------------------
# UPDATE APPLICATION STATUS
# -----------------------------------------------------

@app.put(
    "/applications/{application_id}/status",
    response_model=ApplicationResponse
)
def update_application_status(
    application_id: int,
    status: Literal[
        "applied",
        "shortlisted",
        "rejected",
        "selected"
    ],
    current_user: dict = Depends(
        require_role("recruiter")
    ),
    db: Session = Depends(get_db)
):

    application = application_crud.get_application(
        db,
        application_id
    )

    if not application:

        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    job = job_crud.get_job(
        db,
        application.job_id
    )

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if job.recruiter_id != current_user["user_id"]:

        raise HTTPException(
            status_code=403,
            detail="You can only update applications for your own jobs"
        )

    return application_crud.update_application_status(
        db,
        application_id,
        status
    )


# -----------------------------------------------------
# MY APPLICATIONS
# -----------------------------------------------------

@app.get(
    "/my-applications",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    current_user: dict = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):

    return application_crud.get_user_applications(
        db,
        current_user["user_id"]
    )


# =====================================================
# RESUME UPLOAD
# =====================================================

@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(
        require_role("candidate")
    )
):

    if file.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    filename = (
        f"{current_user['user_id']}_"
        f"{uuid.uuid4().hex}.pdf"
    )

    file_path = os.path.join(
        RESUME_FOLDER,
        filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    return {
        "message": "Resume uploaded successfully",
        "filename": filename,
        "path": file_path
    }


# =====================================================
# VIEW / DOWNLOAD RESUME
# =====================================================

@app.get("/resume/{filename}")
def get_resume(
    filename: str,
    current_user: dict = Depends(
        require_role("recruiter")
    )
):

    file_path = os.path.join(
        RESUME_FOLDER,
        filename
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename
    )
