"""
Database models for Cura AI
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """User model for authentication and profile"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships - One user can have multiple records
    prescriptions = relationship("Prescription", back_populates="user", cascade="all, delete-orphan")
    medical_reports = relationship("MedicalReport", back_populates="user", cascade="all, delete-orphan")
    symptom_interactions = relationship("SymptomInteraction", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Prescription(Base):
    """
    Model for storing prescription data
    
    This table stores:
    - Uploaded prescription files
    - OCR extracted text
    - AI-simplified explanation
    - Identified medicines and dosages
    """
    
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # File information
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # Where file is stored on server
    file_type = Column(String(50), nullable=False)  # jpg, png, pdf
    file_size = Column(Integer, nullable=True)  # Size in bytes
    
    # OCR extracted data
    extracted_text = Column(Text, nullable=True)  # Raw OCR output
    
    # Parsed medicine information (stored as JSON or text)
    medicines = Column(Text, nullable=True)  # JSON array of medicine objects
    
    # AI-generated explanation
    simplified_explanation = Column(Text, nullable=True)  # User-friendly explanation
    
    # Processing status
    processing_status = Column(String(50), default="pending")  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)  # Error if processing failed
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to User
    user = relationship("User", back_populates="prescriptions")
    
    def __repr__(self):
        return f"<Prescription(id={self.id}, user_id={self.user_id}, status='{self.processing_status}')>"


class MedicalReport(Base):
    """
    Model for storing medical report analysis
    
    This table stores:
    - Uploaded medical reports (blood tests, X-rays, etc.)
    - Extracted values and metrics
    - Abnormality detection results
    - AI-generated health summary
    """
    
    __tablename__ = "medical_reports"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Report metadata
    report_type = Column(String(100), nullable=False)  # blood_test, xray, ct_scan, mri, etc.
    report_title = Column(String(255), nullable=True)  # User-provided or auto-detected
    
    # File information
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=True)
    
    # Extracted data
    extracted_text = Column(Text, nullable=True)  # Raw OCR text
    detected_values = Column(Text, nullable=True)  # JSON of key-value pairs (e.g., {"Hemoglobin": "13.5"})
    
    # Analysis results
    abnormalities_detected = Column(Text, nullable=True)  # JSON array of abnormal values
    risk_level = Column(String(50), nullable=True)  # low, medium, high
    
    # AI Summary
    ai_summary = Column(Text, nullable=True)  # Simplified explanation
    recommendations = Column(Text, nullable=True)  # Health advice
    
    # Processing status
    processing_status = Column(String(50), default="pending")
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to User
    user = relationship("User", back_populates="medical_reports")
    
    def __repr__(self):
        return f"<MedicalReport(id={self.id}, user_id={self.user_id}, type='{self.report_type}')>"


class SymptomInteraction(Base):
    """
    Model for storing symptom checker interactions
    
    This table stores:
    - User-reported symptoms
    - AI analysis and suggestions
    - Possible conditions
    - Health advice provided
    """
    
    __tablename__ = "symptom_interactions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # User input
    symptoms_text = Column(Text, nullable=False)  # Raw user description
    detected_symptoms = Column(Text, nullable=True)  # JSON array of identified symptoms
    
    # Additional context (age, gender, duration, etc.)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    symptom_duration = Column(String(100), nullable=True)  # "2 days", "1 week", etc.
    severity = Column(String(50), nullable=True)  # mild, moderate, severe
    
    # AI Analysis results
    possible_conditions = Column(Text, nullable=True)  # JSON array of possible conditions
    confidence_score = Column(Float, nullable=True)  # 0.0 to 1.0
    
    # Recommendations
    home_care_advice = Column(Text, nullable=True)  # What user can do at home
    when_to_see_doctor = Column(Text, nullable=True)  # Warning signs
    urgency_level = Column(String(50), nullable=True)  # routine, urgent, emergency
    
    # Processing status
    processing_status = Column(String(50), default="completed")
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to User
    user = relationship("User", back_populates="symptom_interactions")
    
    def __repr__(self):
        return f"<SymptomInteraction(id={self.id}, user_id={self.user_id}, urgency='{self.urgency_level}')>"
