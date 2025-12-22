"""
Prescription OCR Testing Script

This script helps you test the OCR accuracy with sample prescription images.
It shows you what the system extracts and what safeguards are in place.
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ocr_processor import (
    extract_text_from_image,
    parse_medicine_info,
    preprocess_image
)
import json


def test_prescription_ocr(image_path: str):
    """Test OCR on a prescription image"""
    
    print("=" * 70)
    print("🧪 PRESCRIPTION OCR ACCURACY TEST")
    print("=" * 70)
    print(f"\n📁 Testing image: {image_path}\n")
    
    # Check if file exists
    if not os.path.exists(image_path):
        print(f"❌ ERROR: File not found: {image_path}")
        print("\nPlease provide a valid prescription image path.")
        return
    
    # Test preprocessing
    print("Step 1: Image Preprocessing...")
    processed = preprocess_image(image_path)
    if processed is None:
        print("❌ FAILED: Could not preprocess image")
        return
    else:
        print("✓ Image preprocessed successfully\n")
    
    # Test OCR extraction
    print("Step 2: OCR Text Extraction...")
    extracted_text, success = extract_text_from_image(image_path)
    
    if not success:
        print(f"❌ FAILED: {extracted_text}")
        return
    
    print("✓ Text extracted successfully\n")
    print("-" * 70)
    print("📄 EXTRACTED TEXT:")
    print("-" * 70)
    print(extracted_text)
    print("-" * 70)
    
    # Test medicine parsing
    print("\nStep 3: Medicine Information Parsing...")
    medicines = parse_medicine_info(extracted_text)
    
    print("\n" + "=" * 70)
    print("💊 DETECTED MEDICINES:")
    print("=" * 70)
    print(json.dumps(medicines, indent=2))
    
    # Accuracy assessment
    print("\n" + "=" * 70)
    print("🎯 ACCURACY ASSESSMENT:")
    print("=" * 70)
    
    if medicines and 'message' not in medicines[0]:
        print(f"✓ Detected {len(medicines)} medicine(s)")
        
        low_confidence = sum(1 for m in medicines if m.get('confidence') == 'low')
        medium_confidence = sum(1 for m in medicines if m.get('confidence') == 'medium')
        high_confidence = sum(1 for m in medicines if m.get('confidence') == 'high')
        
        print(f"\nConfidence Distribution:")
        print(f"  🔴 Low:    {low_confidence}")
        print(f"  🟡 Medium: {medium_confidence}")
        print(f"  🟢 High:   {high_confidence}")
        
        if low_confidence > 0:
            print(f"\n⚠️ WARNING: {low_confidence} medicine(s) have LOW confidence")
            print("   Action Required: Manual verification is CRITICAL")
        
        print("\n✅ SAFETY CHECKS:")
        print("   ✓ All medicines marked as 'requires_verification: true'")
        print("   ✓ User will see safety disclaimers")
        print("   ✓ Confidence scores displayed to user")
        
    else:
        print("❌ No medicines detected automatically")
        print("   This triggers fallback mode with safety warnings")
    
    print("\n" + "=" * 70)
    print("🔬 TESTING RECOMMENDATIONS:")
    print("=" * 70)
    print("""
1. ✓ Compare extracted text with original prescription
2. ✓ Verify ALL medicine names match exactly
3. ✓ Check ALL dosages (numbers must be exact)
4. ✓ Confirm frequency/timing instructions
5. ✓ Look for any OCR errors or misreadings

CRITICAL: If ANY discrepancies found, the user should:
- Re-upload a clearer image
- Manually verify with original prescription
- Consult pharmacist if uncertain
""")
    
    print("=" * 70)
    print("📊 TEST COMPLETE")
    print("=" * 70)


def create_sample_test():
    """Create a sample test with dummy image"""
    print("\n🧪 PRESCRIPTION OCR TESTING GUIDE")
    print("=" * 70)
    print("""
To test OCR accuracy with your prescription image:

1. Take a CLEAR photo of your prescription:
   ✓ Good lighting (natural light is best)
   ✓ Image is straight (not tilted)
   ✓ Text is in focus (not blurry)
   ✓ High resolution (use phone's best quality)
   ✓ Entire prescription is visible

2. Save the image and run this test:
   
   python test_ocr_accuracy.py path/to/prescription.jpg

3. Review the results:
   - Check extracted text matches your prescription
   - Verify medicine names are correct
   - Confirm dosages match EXACTLY
   - Look at confidence scores

4. If accuracy is low:
   - Take a better quality photo
   - Ensure prescription is typed (not handwritten)
   - Try scanning instead of phone photo
   - Contact pharmacist for verification

SAFETY NOTE: This tool is for assistance only. NEVER rely solely
on AI-extracted information for medication. Always verify with the
original prescription and healthcare professionals.
""")
    print("=" * 70)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        test_prescription_ocr(image_path)
    else:
        create_sample_test()
        print("\nUsage: python test_ocr_accuracy.py <path_to_prescription_image>")
        print("Example: python test_ocr_accuracy.py ../uploads/prescription.jpg\n")
