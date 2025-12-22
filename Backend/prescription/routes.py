"""
Prescription Routes

Handles prescription upload, OCR processing, and retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import json
from datetime import datetime
import uuid

from database import get_db
from models import User, Prescription
from schemas import (
    PrescriptionUploadResponse,
    PrescriptionListItem,
    PrescriptionDetail
)
from utils.dependencies import get_current_user
from utils.responses import success_response, error_response
from utils.ocr_processor import (
    extract_text_from_image,
    extract_text_from_pdf,
    parse_medicine_info
)

router = APIRouter()

# Upload directory configuration
UPLOAD_DIR = "uploads/prescriptions"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def save_uploaded_file(file: UploadFile) -> tuple:
    """
    Save uploaded file to server
    
    Args:
        file: Uploaded file object
        
    Returns:
        Tuple of (file_path, file_size, error_message)
    """
    try:
        # Validate file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            return None, 0, f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        file_size = 0
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            file_size = len(content)
            
            # Check file size
            if file_size > MAX_FILE_SIZE:
                return None, 0, f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)} MB"
            
            buffer.write(content)
        
        return file_path, file_size, None
        
    except Exception as e:
        return None, 0, f"Failed to save file: {str(e)}"


def process_prescription(file_path: str, file_type: str) -> tuple:
    """
    Process prescription file using OCR
    
    Args:
        file_path: Path to saved file
        file_type: File extension (.jpg, .png, .pdf)
        
    Returns:
        Tuple of (extracted_text, medicines_json, simplified_explanation, error)
    """
    try:
        print(f"\n🔍 DEBUG: Processing prescription file: {file_path}")
        print(f"📄 DEBUG: File type: {file_type}")
        
        # Extract text based on file type
        if file_type in ['.jpg', '.jpeg', '.png']:
            print("🖼️ DEBUG: Extracting text from image using OCR...")
            extracted_text, success = extract_text_from_image(file_path)
        elif file_type == '.pdf':
            print("📑 DEBUG: Extracting text from PDF...")
            extracted_text, success = extract_text_from_pdf(file_path)
        else:
            return None, None, None, "Unsupported file type"
        
        print(f"✅ DEBUG: OCR Success: {success}")
        print(f"📝 DEBUG: Extracted text length: {len(extracted_text) if extracted_text else 0} chars")
        print(f"📝 DEBUG: First 200 chars: {extracted_text[:200] if extracted_text else 'None'}...")
        
        if not success:
            print(f"❌ DEBUG: OCR failed with error: {extracted_text}")
            return None, None, None, extracted_text  # Error message
        
        # Parse medicine information
        print("💊 DEBUG: Parsing medicine information...")
        medicines = parse_medicine_info(extracted_text)
        medicines_json = json.dumps(medicines, indent=2)
        
        print(f"💊 DEBUG: Detected {len(medicines)} medicine(s)")
        print(f"💊 DEBUG: Medicines JSON: {medicines_json[:300]}...")
        
        # Generate simplified explanation
        print("📋 DEBUG: Generating explanation...")
        explanation = generate_simple_explanation(medicines)
        
        print("✅ DEBUG: Processing completed successfully\n")
        
        return extracted_text, medicines_json, explanation, None
        
    except Exception as e:
        return None, None, None, f"Processing failed: {str(e)}"


def generate_simple_explanation(medicines: list) -> str:
    """
    Generate a simplified explanation of the prescription
    
    Args:
        medicines: List of medicine dictionaries
        
    Returns:
        User-friendly explanation text with safety disclaimers
    """
    explanation = "🚨 **CRITICAL MEDICAL SAFETY NOTICE** 🚨\n\n"
    explanation += "⚠️ This is an AI-powered text extraction tool ONLY. It is NOT a substitute for professional medical advice.\n\n"
    explanation += "✅ **REQUIRED ACTIONS:**\n"
    explanation += "• ✓ ALWAYS verify all information with your original prescription\n"
    explanation += "• ✓ NEVER rely solely on this AI extraction for dosage or timing\n"
    explanation += "• ✓ Consult your doctor or pharmacist if anything is unclear\n"
    explanation += "• ✓ Double-check ALL medicine names and dosages before taking\n\n"
    explanation += "=" * 60 + "\n\n"
    
    if not medicines or (len(medicines) == 1 and 'message' in medicines[0]):
        explanation += "❌ **Automatic Detection Failed**\n\n"
        explanation += "We couldn't automatically detect specific medicines from your prescription image.\n"
        explanation += "This could be due to:\n"
        explanation += "• Poor image quality or lighting\n"
        explanation += "• Handwritten prescription (harder to read)\n"
        explanation += "• Image is blurry or at an angle\n\n"
        explanation += "📋 **What to do:**\n"
        explanation += "1. Review the extracted text below carefully\n"
        explanation += "2. Compare it with your original prescription\n"
        explanation += "3. If text is unclear, take a clearer photo and upload again\n"
        explanation += "4. Contact your pharmacist for clarification\n\n"
        return explanation
    
    explanation += "📋 **Detected Information (REQUIRES VERIFICATION):**\n\n"
    explanation += f"Found {len(medicines)} medicine(s) - Each MUST be verified:\n\n"
    
    for i, med in enumerate(medicines, 1):
        medicine_name = med.get('medicine_name', '❓ Unknown')
        dosage = med.get('dosage', '❓ Not detected')
        instructions = med.get('instructions', 'See original prescription')
        confidence = med.get('confidence', 'low')
        
        # Add warning icon based on confidence
        confidence_icon = "🟢" if confidence == "high" else "🟡" if confidence == "medium" else "🔴"
        
        explanation += f"{i}. {confidence_icon} **{medicine_name}**\n"
        explanation += f"   • Dosage: {dosage}\n"
        explanation += f"   • Instructions: {instructions}\n"
        explanation += f"   • Detection Confidence: {confidence.upper()}\n"
        if confidence == "low":
            explanation += f"   • ⚠️ **LOW CONFIDENCE - MUST VERIFY WITH ORIGINAL**\n"
        explanation += "\n"
    
    explanation += "\n🔴 **CRITICAL SAFETY REMINDERS:**\n"
    explanation += "• ✓ Take medicines EXACTLY as prescribed by your doctor\n"
    explanation += "• ✓ Complete the FULL course - don't stop early\n"
    explanation += "• ✓ Take at the CORRECT times (morning/evening as prescribed)\n"
    explanation += "• ✓ Report ANY side effects to your doctor immediately\n"
    explanation += "• ✓ Store medicines away from children and pets\n"
    explanation += "• ✓ Check expiry dates before taking\n"
    explanation += "• ✓ Don't share medicines with others\n\n"
    
    explanation += "☎️ **When to Contact Doctor:**\n"
    explanation += "• Severe side effects or allergic reactions\n"
    explanation += "• Symptoms worsen or don't improve\n"
    explanation += "• Questions about dosage or timing\n"
    explanation += "• Any concerns about the medication\n\n"
    
    explanation += "=" * 60 + "\n"
    explanation += "💊 **Remember**: Your health is important. When in doubt, always consult a healthcare professional!\n"
    
    return explanation


@router.post("/upload", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and process a prescription
    
    **Process:**
    1. Validates and saves the uploaded file
    2. Extracts text using OCR (Tesseract)
    3. Identifies medicines and dosages
    4. Generates user-friendly explanation
    5. Stores everything in database
    
    **Accepts:**
    - Images: JPG, PNG
    - Documents: PDF
    
    **Returns:**
    - Prescription record with extracted information
    """
    
    # Save uploaded file
    file_path, file_size, error = save_uploaded_file(file)
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    # Get file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    # Create database record
    prescription = Prescription(
        user_id=current_user.id,
        original_filename=file.filename,
        file_path=file_path,
        file_type=file_ext[1:],  # Remove the dot
        file_size=file_size,
        processing_status="processing"
    )
    
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    
    # Process the prescription (OCR)
    extracted_text, medicines_json, explanation, process_error = process_prescription(
        file_path, file_ext
    )
    
    if process_error:
        # Update record with error
        prescription.processing_status = "failed"
        prescription.error_message = process_error
        db.commit()
        db.refresh(prescription)
        
        return success_response(
            message="Prescription uploaded but processing failed",
            data=PrescriptionUploadResponse.from_orm(prescription).dict()
        )
    
    # Update record with processed data
    prescription.extracted_text = extracted_text
    prescription.medicines = medicines_json
    prescription.simplified_explanation = explanation
    prescription.processing_status = "completed"
    
    db.commit()
    db.refresh(prescription)
    
    return success_response(
        message="Prescription uploaded and processed successfully",
        data=PrescriptionUploadResponse.from_orm(prescription).dict()
    )


@router.get("/list", response_model=dict)
async def get_prescriptions(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get list of user's prescriptions
    
    **Query Parameters:**
    - skip: Number of records to skip (for pagination)
    - limit: Maximum number of records to return
    
    **Returns:**
    - List of prescription summaries
    """
    
    prescriptions = db.query(Prescription)\
        .filter(Prescription.user_id == current_user.id)\
        .order_by(Prescription.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    prescription_list = [
        PrescriptionListItem.from_orm(p).dict() for p in prescriptions
    ]
    
    return success_response(
        message=f"Retrieved {len(prescription_list)} prescription(s)",
        data={
            "prescriptions": prescription_list,
            "total": len(prescription_list),
            "skip": skip,
            "limit": limit
        }
    )


@router.get("/{prescription_id}", response_model=dict)
async def get_prescription_detail(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific prescription
    
    **Path Parameters:**
    - prescription_id: ID of the prescription
    
    **Returns:**
    - Complete prescription details including extracted text and explanations
    """
    
    prescription = db.query(Prescription)\
        .filter(
            Prescription.id == prescription_id,
            Prescription.user_id == current_user.id
        )\
        .first()
    
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found"
        )
    
    return success_response(
        message="Prescription retrieved successfully",
        data=PrescriptionDetail.from_orm(prescription).dict()
    )


@router.delete("/{prescription_id}", response_model=dict)
async def delete_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a prescription
    
    **Path Parameters:**
    - prescription_id: ID of the prescription to delete
    
    **Returns:**
    - Confirmation message
    """
    
    prescription = db.query(Prescription)\
        .filter(
            Prescription.id == prescription_id,
            Prescription.user_id == current_user.id
        )\
        .first()
    
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found"
        )
    
    # Delete file from disk
    try:
        if os.path.exists(prescription.file_path):
            os.remove(prescription.file_path)
    except Exception as e:
        print(f"Warning: Could not delete file {prescription.file_path}: {e}")
    
    # Delete from database
    db.delete(prescription)
    db.commit()
    
    return success_response(
        message="Prescription deleted successfully",
        data={"id": prescription_id}
    )
