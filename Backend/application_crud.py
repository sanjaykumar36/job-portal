
from sqlalchemy.orm import Session

from models import Application, Job, User
from schemas import ApplicationCreate


# =====================================================
# CREATE APPLICATION
# =====================================================

def create_application(
    db: Session,
    application: ApplicationCreate,
    user_id: int
):

    new_application = Application(
        job_id=application.job_id,
        user_id=user_id,
        resume=application.resume,
        status="applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


# =====================================================
# GET ALL APPLICATIONS
# =====================================================

def get_all_applications(
    db: Session
):

    return db.query(Application).all()


# =====================================================
# GET ONE APPLICATION
# =====================================================

def get_application(
    db: Session,
    application_id: int
):

    return db.query(Application).filter(
        Application.id == application_id
    ).first()


# =====================================================
# GET USER APPLICATIONS
# =====================================================

def get_user_applications(
    db: Session,
    user_id: int
):

    return db.query(Application).filter(
        Application.user_id == user_id
    ).all()


# =====================================================
# GET RECRUITER APPLICATIONS
# =====================================================

def get_recruiter_applications(
    db: Session,
    recruiter_id: int
):

    results = (
        db.query(
            Application.id,
            Application.job_id,
            Application.user_id,
            User.name.label("candidate_name"),
            User.email.label("candidate_email"),
            Job.title.label("job_title"),
            Application.resume,
            Application.status
        )
        .join(
            Job,
            Application.job_id == Job.id
        )
        .join(
            User,
            Application.user_id == User.id
        )
        .filter(
            Job.recruiter_id == recruiter_id
        )
        .all()
    )

    return results


# =====================================================
# UPDATE APPLICATION STATUS
# =====================================================

def update_application_status(
    db: Session,
    application_id: int,
    status: str
):

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        return None

    application.status = status

    db.commit()
    db.refresh(application)

    return application

