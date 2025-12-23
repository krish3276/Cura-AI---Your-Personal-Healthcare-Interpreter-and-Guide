"""
Test medicine parsing with sample prescription text
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from utils.ocr_processor import parse_medicine_info

# Sample prescription text (similar to the user's prescription)
sample_prescription = """
Dr. Sachin Bansare
12/12/22                                28/m

Rx

after meals:
Tab. Augmentin 625mg
1 - 0 - 1  x 5days

Tab. Enaflam
1 - 0 - 1  x 5days

before meals:
Tab. Pan D 40mg
1 - 0 - 0  x 5days

Adv: Hexigel gum paint massage
1 - 0 - 1  x 1week
"""

print("=" * 80)
print("TESTING MEDICINE PARSER")
print("=" * 80)

print("\n📄 Sample Prescription Text:")
print("-" * 80)
print(sample_prescription)
print("-" * 80)

print("\n💊 Parsing medicines...")
medicines = parse_medicine_info(sample_prescription)

print(f"\n✅ Found {len(medicines)} medicine(s):\n")

for i, med in enumerate(medicines, 1):
    print(f"{i}. {med.get('medicine_name', 'Unknown')}")
    print(f"   Dosage: {med.get('dosage', 'Not specified')}")
    print(f"   Instructions: {med.get('instructions', 'See prescription')}")
    print(f"   Confidence: {med.get('confidence', 'low').upper()}")
    print()

print("=" * 80)

# Test with various formats
test_cases = [
    "Tab. Paracetamol 500mg 1-1-1 x 5days",
    "Capsule Amoxicillin 250mg twice daily",
    "Syrup Crocin 100ml 5ml thrice daily",
    "Tablet Aspirin 75mg once daily after meals",
]

print("\n📋 Testing Other Formats:")
print("-" * 80)

for test in test_cases:
    print(f"\nInput: {test}")
    result = parse_medicine_info(test)
    if result and 'medicine_name' in result[0]:
        print(f"  → Medicine: {result[0]['medicine_name']}")
        print(f"  → Dosage: {result[0]['dosage']}")
    else:
        print("  → Not detected")

print("\n" + "=" * 80)
