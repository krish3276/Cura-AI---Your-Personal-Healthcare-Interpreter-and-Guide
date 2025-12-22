"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List, Dict, Any
import re


class UserSignup(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=50, description="Username for login")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, max_length=100, description="Strong password")
    
    @validator('username')
    def username_alphanumeric(cls, v):
        """Validate username contains only alphanumeric characters and underscores"""
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username must contain only letters, numbers, and underscores')
        return v
    
    @validator('password')
    def password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="User password")


class UserResponse(BaseModel):
    """Schema for user data response"""
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 18000  # 5 hours in seconds


class TokenData(BaseModel):
    """Schema for token payload data"""
    user_id: Optional[int] = None
    username: Optional[str] = None


class DashboardResponse(BaseModel):
    """Schema for dashboard data"""
    message: str
    user: UserResponse
    timestamp: datetime


# ==========================================
# PRESCRIPTION SCHEMAS
# ==========================================

class PrescriptionUploadResponse(BaseModel):
    """Response after prescription upload"""
    id: int
    original_filename: str
    file_type: str
    processing_status: str
    extracted_text: Optional[str] = None
    medicines: Optional[str] = None
    simplified_explanation: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class PrescriptionListItem(BaseModel):
    """Schema for prescription in list view"""
    id: int
    original_filename: str
    file_type: str
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class PrescriptionDetail(BaseModel):
    """Detailed prescription response"""
    id: int
    original_filename: str
    file_path: str
    file_type: str
    file_size: Optional[int]
    extracted_text: Optional[str]
    medicines: Optional[str]
    simplified_explanation: Optional[str]
    processing_status: str
    error_message: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ==========================================
# MEDICAL REPORT SCHEMAS
# ==========================================

class MedicalReportUploadRequest(BaseModel):
    """Request body for report upload (multipart form data)"""
    report_type: str = Field(..., description="Type of report: blood_test, xray, ct_scan, mri, etc.")
    report_title: Optional[str] = Field(None, description="Optional title for the report")


class MedicalReportUploadResponse(BaseModel):
    """Response after report upload"""
    id: int
    report_type: str
    report_title: Optional[str]
    original_filename: str
    file_type: str
    processing_status: str
    ai_summary: Optional[str] = None
    risk_level: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class MedicalReportListItem(BaseModel):
    """Schema for report in list view"""
    id: int
    report_type: str
    report_title: Optional[str]
    original_filename: str
    risk_level: Optional[str]
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class MedicalReportDetail(BaseModel):
    """Detailed medical report response"""
    id: int
    report_type: str
    report_title: Optional[str]
    original_filename: str
    file_path: str
    file_type: str
    extracted_text: Optional[str]
    detected_values: Optional[str]
    abnormalities_detected: Optional[str]
    risk_level: Optional[str]
    ai_summary: Optional[str]
    recommendations: Optional[str]
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==========================================
# SYMPTOM CHECKER SCHEMAS
# ==========================================

class SymptomAnalysisRequest(BaseModel):
    """Request for symptom analysis"""
    symptoms_text: str = Field(..., min_length=5, max_length=1000, description="Describe your symptoms")
    age: Optional[int] = Field(None, ge=1, le=150, description="Patient age")
    gender: Optional[str] = Field(None, description="Gender: male, female, other")
    symptom_duration: Optional[str] = Field(None, description="How long you've had symptoms")
    severity: Optional[str] = Field(None, description="Severity: mild, moderate, severe")
    
    @validator('gender')
    def validate_gender(cls, v):
        if v and v.lower() not in ['male', 'female', 'other', 'prefer not to say']:
            raise ValueError('Gender must be: male, female, other, or prefer not to say')
        return v.lower() if v else None
    
    @validator('severity')
    def validate_severity(cls, v):
        if v and v.lower() not in ['mild', 'moderate', 'severe']:
            raise ValueError('Severity must be: mild, moderate, or severe')
        return v.lower() if v else None


class SymptomAnalysisResponse(BaseModel):
    """Response from symptom analysis"""
    id: int
    symptoms_text: str
    detected_symptoms: Optional[List[str]] = None
    possible_conditions: Optional[List[str]] = None
    confidence_score: Optional[float] = None
    home_care_advice: Optional[str] = None
    when_to_see_doctor: Optional[str] = None
    urgency_level: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SymptomInteractionListItem(BaseModel):
    """Schema for symptom interaction in history"""
    id: int
    symptoms_text: str
    urgency_level: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
