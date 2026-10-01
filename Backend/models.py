from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


# =====================================================
# USER MODEL
# =====================================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="candidate"
    )


# =====================================================
# JOB MODEL
# =====================================================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    location = Column(
        String(100),
        nullable=False
    )

    salary = Column(
        String(100),
        nullable=False
    )

    recruiter_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


# =====================================================
# APPLICATION MODEL
# =====================================================

class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    resume = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(30),
        default="applied"
    )