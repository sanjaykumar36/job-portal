from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate
from auth import hash_password


def create_user(user: UserCreate, db: Session):

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def getall(db: Session):
    return db.query(User).all()


def getone(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def getuser_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def update_user(db: Session, user_id: int, updated_user: UserCreate):

    user = db.query(User).filter(User.id == user_id).first()

    if user:
        user.name = updated_user.name
        user.email = updated_user.email
        user.password = hash_password(updated_user.password)
        user.role = updated_user.role

        db.commit()
        db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()

    if user:
        db.delete(user)
        db.commit()

    return user