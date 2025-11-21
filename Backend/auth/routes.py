"""
Authentication routes for user registration, login, and dashboard
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import User
from schemas import UserSignup, UserLogin, UserResponse, TokenResponse, DashboardResponse
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token, create_refresh_token
from utils.dependencies import get_current_user
from utils.responses import success_response, error_response

router = APIRouter()


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - **username**: Unique username (3-50 characters, alphanumeric + underscore)
    - **email**: Valid email address
    - **password**: Strong password (min 8 chars, uppercase, lowercase, digit)
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return success_response(
        message="User registered successfully",
        data={
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    )


@router.post("/login", response_model=dict)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT tokens
    
    - **username**: Username or email
    - **password**: User password
    
    Returns access_token and refresh_token
    """
    # Find user by username or email
    user = db.query(User).filter(
        (User.username == user_credentials.username) | 
        (User.email == user_credentials.username)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Create access and refresh tokens
    token_data = {"user_id": user.id, "username": user.username}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    return success_response(
        message="Login successful",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 18000,  # 5 hours in seconds
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }
    )


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Requires valid JWT token in Authorization header
    """
    return success_response(
        message="User retrieved successfully",
        data={
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        }
    )


@router.get("/dashboard", response_model=dict)
async def dashboard(current_user: User = Depends(get_current_user)):
    """
    Protected dashboard endpoint
    
    Returns personalized dashboard data for authenticated user
    Requires valid JWT token in Authorization header
    """
    return success_response(
        message=f"Welcome to your dashboard, {current_user.username}!",
        data={
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "is_active": current_user.is_active,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None
            },
            "timestamp": datetime.utcnow().isoformat(),
            "dashboard_stats": {
                "total_consultations": 0,
                "pending_appointments": 0,
                "health_records": 0
            }
        }
    )
