"""
OCR Processing Utilities

This module handles:
- Image preprocessing using OpenCV
- Text extraction using Tesseract OCR
- Basic text cleaning
"""

import os
import cv2
import numpy as np
from typing import Optional, Tuple
import re

# ==============================================================================
# TESSERACT OCR PATH CONFIGURATION
# ==============================================================================
# If you installed Tesseract OCR manually, set the path here:
# 
# For Windows (default installation):
# TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
#
# For Mac (via Homebrew):
# TESSERACT_PATH = '/usr/local/bin/tesseract'
#
# For Linux (via apt):
# TESSERACT_PATH = '/usr/bin/tesseract'
#
# Leave as None to auto-detect from system PATH
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Uncomment and set the path after installing Tesseract:
# TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# ==============================================================================


def preprocess_image(image_path: str) -> Optional[np.ndarray]:
    """
    Preprocess image for better OCR accuracy
    
    Steps:
    1. Convert to grayscale
    2. Apply thresholding to make text clearer
    3. Remove noise
    4. Sharpen image
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Preprocessed image as numpy array, or None if failed
    """
    try:
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not read image from {image_path}")
            return None
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive thresholding for better text detection
        # This works better than simple thresholding for varying lighting
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Remove noise using morphological operations
        kernel = np.ones((1, 1), np.uint8)
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        processed = cv2.morphologyEx(processed, cv2.MORPH_OPEN, kernel)
        
        # Apply slight blur to reduce noise further
        processed = cv2.medianBlur(processed, 3)
        
        return processed
        
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None


def extract_text_from_image(image_path: str) -> Tuple[str, bool]:
    """
    Extract text from image using Tesseract OCR
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Tuple of (extracted_text, success_flag)
    """
    try:
        # Check if pytesseract is available
        try:
            import pytesseract
            
            # Set Tesseract executable path if configured
            if TESSERACT_PATH:
                pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
                
        except ImportError:
            return "⚠️ OCR library not installed. Please install pytesseract and Tesseract OCR.", False
        
        # Preprocess the image
        processed_image = preprocess_image(image_path)
        
        if processed_image is None:
            return "❌ Failed to preprocess image. Please ensure the image is clear and not corrupted.", False
        
        # Perform OCR with confidence data
        custom_config = r'--oem 3 --psm 6'  # OCR Engine Mode 3, Page Segmentation Mode 6
        text = pytesseract.image_to_string(processed_image, config=custom_config)
        
        # Get OCR data for confidence checking
        try:
            ocr_data = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT, config=custom_config)
            confidences = [int(conf) for conf in ocr_data['conf'] if conf != '-1']
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        except:
            avg_confidence = 0
        
        # Clean the extracted text
        text = clean_extracted_text(text)
        
        # Quality checks
        if not text or len(text.strip()) < 10:
            return "❌ No readable text found. Please upload a clearer image with better lighting.", False
        
        # Add quality warning if confidence is low
        quality_warning = ""
        if avg_confidence < 50:
            quality_warning = f"\n\n⚠️ WARNING: Low OCR confidence ({avg_confidence:.0f}%). Text may be inaccurate. Please verify all information carefully.\n"
        elif avg_confidence < 70:
            quality_warning = f"\n\n⚠️ CAUTION: Moderate OCR quality ({avg_confidence:.0f}%). Double-check all dosages and medicine names.\n"
        
        return quality_warning + text, True
        
    except Exception as e:
        return f"OCR extraction failed: {str(e)}", False


def extract_text_from_pdf(pdf_path: str) -> Tuple[str, bool]:
    """
    Extract text from PDF file
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Tuple of (extracted_text, success_flag)
    """
    try:
        # Check if PyPDF2 is available
        try:
            from PyPDF2 import PdfReader
        except ImportError:
            return "PDF library not installed. Please install PyPDF2.", False
        
        # Read PDF
        reader = PdfReader(pdf_path)
        text = ""
        
        # Extract text from all pages
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Clean the extracted text
        text = clean_extracted_text(text)
        
        if not text or len(text.strip()) < 10:
            return "No readable text found in the PDF", False
        
        return text, True
        
    except Exception as e:
        return f"PDF extraction failed: {str(e)}", False


def clean_extracted_text(text: str) -> str:
    """
    Clean and normalize extracted text
    
    - Remove extra whitespaces
    - Normalize line breaks
    - Preserve numbers for dosage accuracy
    
    Args:
        text: Raw extracted text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)
    
    # Normalize line breaks (keep structure)
    text = re.sub(r'\n\s*\n', '\n', text)
    
    # CRITICAL: Do NOT replace 0→O or 1→I as it causes dosage errors
    # Example: "500mg" would become "5OOmg" - DANGEROUS!
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    return text


def parse_medicine_info(text: str) -> list:
    """
    Extract medicine names and dosages from prescription text
    
    IMPORTANT: This uses basic pattern matching and requires manual verification.
    For production, use medical NER (Named Entity Recognition) models.
    
    Args:
        text: Extracted prescription text
        
    Returns:
        List of dictionaries with medicine information
    """
    medicines = []
    
    # Pattern for medicine lines: Name + Dosage (numbers + units)
    # Example: "Paracetamol 500mg twice daily"
    # Example: "Amoxicillin 250 mg - 3 times daily"
    
    lines = text.split('\n')
    
    # Dosage pattern: numbers followed by units
    dosage_pattern = r'\b(\d+\.?\d*)\s*(mg|ml|mcg|g|tablet|capsule|cap|tab)s?\b'
    
    # Common frequency words
    frequency_keywords = ['daily', 'times', 'day', 'morning', 'night', 'evening', 'hours', 'weekly']
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue
        
        # Check if line contains dosage information
        dosage_match = re.search(dosage_pattern, line, re.IGNORECASE)
        
        if dosage_match:
            # Extract medicine name (usually first 1-3 words before dosage)
            dosage_position = dosage_match.start()
            medicine_name_part = line[:dosage_position].strip()
            
            # Clean medicine name (remove numbers, bullets)
            medicine_name = re.sub(r'^[\d\.\)\-\*]+\s*', '', medicine_name_part)
            medicine_name = medicine_name.strip()
            
            # Get dosage
            dosage = dosage_match.group(0)
            
            # Get full instructions (everything after medicine name)
            instructions = line[len(medicine_name):].strip()
            
            # Check if frequency is mentioned
            has_frequency = any(keyword in line.lower() for keyword in frequency_keywords)
            
            medicine_info = {
                "medicine_name": medicine_name if medicine_name else "[Name unclear]",
                "dosage": dosage,
                "instructions": instructions if instructions else line,
                "confidence": "medium" if has_frequency and medicine_name else "low",
                "requires_verification": True  # Always require manual check
            }
            medicines.append(medicine_info)
    
    if not medicines:
        return [{
            "message": "⚠️ No medicines detected automatically.",
            "recommendation": "Please review the extracted text manually and consult your doctor or pharmacist.",
            "requires_verification": True
        }]
    
    return medicines
