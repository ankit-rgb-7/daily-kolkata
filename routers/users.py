from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import SQLModel, Session, select
from database import get_session

from models import User, UserPublic
from auth import hash_password, verify_password, create_access_token, get_current_user



router = APIRouter (
    prefix = "/users",
    tags = ["Users"]
)

class RegisterRequest(SQLModel):
    email: str
    password: str
    confirm_password: str

@router.post("/register")
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    hashed_password = hash_password(request.password)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    user = User(
        email = request.email,
        password_hash = hashed_password
    )

    session.add(user)
    session.commit()

    return {"message" : "Registration Successful"}

class LoginRequest(SQLModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({"sub": str(user.id)})
    print(access_token)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserPublic)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user