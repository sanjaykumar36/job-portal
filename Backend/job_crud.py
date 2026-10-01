
from sqlalchemy.orm import Session

from models import Job
from schemas import JobCreate


# =====================================================
# CREATE JOB
# =====================================================

def create_job(
    db: Session,
    job: JobCreate,
    recruiter_id: int
):

    new_job = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        salary=job.salary,
        recruiter_id=recruiter_id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# =====================================================
# GET ALL JOBS
# =====================================================

def get_all_jobs(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    title: str | None = None,
    location: str | None = None
):

    query = db.query(Job)

    # Search by job title
    if title:

        query = query.filter(
            Job.title.ilike(
                f"%{title}%"
            )
        )

    # Filter by location
    if location:

        query = query.filter(
            Job.location.ilike(
                f"%{location}%"
            )
        )

    # Pagination
    jobs = query.offset(
        skip
    ).limit(
        limit
    ).all()

    return jobs


# =====================================================
# GET ONE JOB
# =====================================================

def get_job(
    db: Session,
    job_id: int
):

    return db.query(Job).filter(
        Job.id == job_id
    ).first()


# =====================================================
# UPDATE JOB
# =====================================================

def update_job(
    db: Session,
    job_id: int,
    updated_job: JobCreate
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if job:

        job.title = updated_job.title
        job.description = updated_job.description
        job.location = updated_job.location
        job.salary = updated_job.salary

        db.commit()
        db.refresh(job)

    return job


# =====================================================
# DELETE JOB
# =====================================================

def delete_job(
    db: Session,
    job_id: int
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if job:

        db.delete(job)
        db.commit()

    return job

