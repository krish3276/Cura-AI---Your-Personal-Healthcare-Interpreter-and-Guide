"""
Symptom Analysis Utilities

This module handles:
- Symptom keyword detection
- Basic NLP for symptom matching
- Health advice generation
- Urgency level determination
"""

import re
from typing import List, Dict, Tuple, Optional


# Comprehensive symptom database
SYMPTOM_KEYWORDS = {
    # Respiratory
    'cough': ['cough', 'coughing', 'tussis'],
    'shortness_of_breath': ['shortness of breath', 'breathless', 'dyspnea', 'difficulty breathing', 'cant breathe'],
    'sore_throat': ['sore throat', 'throat pain', 'pharyngitis'],
    'runny_nose': ['runny nose', 'nasal discharge', 'rhinorrhea'],
    'congestion': ['congestion', 'stuffy nose', 'blocked nose', 'nasal obstruction'],
    'wheezing': ['wheezing', 'wheeze', 'whistling breath'],
    
    # Pain
    'headache': ['headache', 'head pain', 'migraine', 'cephalalgia'],
    'chest_pain': ['chest pain', 'chest discomfort', 'angina'],
    'abdominal_pain': ['abdominal pain', 'stomach pain', 'belly pain', 'tummy ache'],
    'back_pain': ['back pain', 'backache', 'spine pain'],
    'joint_pain': ['joint pain', 'arthralgia', 'knee pain', 'elbow pain'],
    'muscle_pain': ['muscle pain', 'myalgia', 'muscle ache', 'body ache'],
    
    # General
    'fever': ['fever', 'high temperature', 'pyrexia', 'hot', 'burning'],
    'fatigue': ['fatigue', 'tired', 'exhausted', 'weakness', 'lethargy'],
    'dizziness': ['dizzy', 'dizziness', 'lightheaded', 'vertigo'],
    'nausea': ['nausea', 'nauseous', 'feel sick', 'queasy'],
    'vomiting': ['vomiting', 'vomit', 'throwing up', 'puking'],
    'diarrhea': ['diarrhea', 'loose stools', 'watery stools'],
    'constipation': ['constipation', 'hard stools', 'difficulty passing stools'],
    
    # Skin
    'rash': ['rash', 'skin eruption', 'hives', 'skin redness'],
    'itching': ['itching', 'itchy', 'pruritus'],
    'swelling': ['swelling', 'edema', 'swollen', 'inflammation'],
    
    # Mental/Neurological
    'confusion': ['confusion', 'confused', 'disoriented', 'mental fog'],
    'anxiety': ['anxiety', 'anxious', 'nervous', 'worried'],
    'insomnia': ['insomnia', 'cant sleep', 'sleepless', 'difficulty sleeping'],
    
    # Other
    'loss_of_appetite': ['loss of appetite', 'no appetite', 'not hungry'],
    'weight_loss': ['weight loss', 'losing weight', 'sudden weight loss'],
    'night_sweats': ['night sweats', 'sweating at night', 'drenching sweats'],
}


# Medical conditions database with associated symptoms
CONDITION_DATABASE = {
    'Common Cold': {
        'symptoms': ['runny_nose', 'congestion', 'sore_throat', 'cough', 'fatigue'],
        'severity': 'mild',
        'description': 'A viral infection of the upper respiratory tract',
    },
    'Flu (Influenza)': {
        'symptoms': ['fever', 'cough', 'fatigue', 'muscle_pain', 'headache', 'sore_throat'],
        'severity': 'moderate',
        'description': 'A contagious respiratory illness caused by influenza viruses',
    },
    'Gastroenteritis': {
        'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever'],
        'severity': 'moderate',
        'description': 'Inflammation of the stomach and intestines',
    },
    'Migraine': {
        'symptoms': ['headache', 'nausea', 'dizziness', 'sensitivity_to_light'],
        'severity': 'moderate',
        'description': 'A neurological condition that causes severe headaches',
    },
    'Anxiety Disorder': {
        'symptoms': ['anxiety', 'fatigue', 'insomnia', 'muscle_pain', 'headache'],
        'severity': 'moderate',
        'description': 'A mental health disorder characterized by excessive worry',
    },
    'Dehydration': {
        'symptoms': ['dizziness', 'fatigue', 'headache', 'dry_mouth'],
        'severity': 'moderate',
        'description': 'Insufficient fluid intake or excessive fluid loss',
    },
}


# Emergency symptoms that require immediate medical attention
EMERGENCY_SYMPTOMS = [
    'chest_pain', 'shortness_of_breath', 'severe_headache', 'confusion',
    'loss_of_consciousness', 'severe_bleeding', 'severe_abdominal_pain'
]


def detect_symptoms(text: str) -> List[str]:
    """
    Detect symptoms from user's text input
    
    Uses keyword matching to identify mentioned symptoms
    
    Args:
        text: User's symptom description
        
    Returns:
        List of detected symptom keys
    """
    text_lower = text.lower()
    detected = []
    
    for symptom_key, keywords in SYMPTOM_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                if symptom_key not in detected:
                    detected.append(symptom_key)
                break
    
    return detected


def analyze_symptoms(symptoms: List[str], age: Optional[int] = None) -> Dict:
    """
    Analyze detected symptoms and suggest possible conditions
    
    Args:
        symptoms: List of detected symptom keys
        age: Patient age (optional, for better analysis)
        
    Returns:
        Dictionary with analysis results
    """
    if not symptoms:
        return {
            'possible_conditions': [],
            'confidence_score': 0.0,
            'urgency_level': 'routine',
            'message': 'No specific symptoms detected. Please describe your symptoms in more detail.'
        }
    
    # Check for emergency symptoms
    has_emergency = any(symptom in EMERGENCY_SYMPTOMS for symptom in symptoms)
    
    if has_emergency:
        return {
            'possible_conditions': ['Medical Emergency'],
            'confidence_score': 1.0,
            'urgency_level': 'emergency',
            'message': '⚠️ EMERGENCY: Please seek immediate medical attention!'
        }
    
    # Match symptoms with conditions
    condition_matches = []
    
    for condition_name, condition_data in CONDITION_DATABASE.items():
        condition_symptoms = set(condition_data['symptoms'])
        user_symptoms = set(symptoms)
        
        # Calculate match percentage
        matching_symptoms = condition_symptoms.intersection(user_symptoms)
        if matching_symptoms:
            match_percentage = len(matching_symptoms) / len(condition_symptoms)
            
            condition_matches.append({
                'condition': condition_name,
                'match_score': match_percentage,
                'description': condition_data['description'],
                'severity': condition_data['severity']
            })
    
    # Sort by match score
    condition_matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    # Determine urgency level
    urgency = determine_urgency(symptoms, condition_matches)
    
    # Calculate overall confidence
    confidence = condition_matches[0]['match_score'] if condition_matches else 0.0
    
    return {
        'possible_conditions': condition_matches[:3],  # Top 3 matches
        'confidence_score': round(confidence, 2),
        'urgency_level': urgency,
        'message': 'Analysis completed'
    }


def determine_urgency(symptoms: List[str], conditions: List[Dict]) -> str:
    """
    Determine urgency level based on symptoms and conditions
    
    Args:
        symptoms: Detected symptoms
        conditions: Matched conditions
        
    Returns:
        Urgency level: 'routine', 'urgent', or 'emergency'
    """
    # Check for emergency symptoms
    if any(symptom in EMERGENCY_SYMPTOMS for symptom in symptoms):
        return 'emergency'
    
    # Check severity of matched conditions
    if conditions:
        severities = [c['severity'] for c in conditions]
        if 'severe' in severities:
            return 'urgent'
        if 'moderate' in severities and len(symptoms) >= 4:
            return 'urgent'
    
    # Default to routine
    return 'routine'


def generate_home_care_advice(symptoms: List[str], conditions: List[Dict]) -> str:
    """
    Generate home care advice based on symptoms
    
    Args:
        symptoms: Detected symptoms
        conditions: Matched conditions
        
    Returns:
        Home care advice text
    """
    advice = []
    
    # General advice
    advice.append("**General Care:**")
    advice.append("• Get plenty of rest")
    advice.append("• Stay hydrated - drink water regularly")
    advice.append("• Eat nutritious, light meals")
    
    # Symptom-specific advice
    if 'fever' in symptoms:
        advice.append("\n**For Fever:**")
        advice.append("• Take paracetamol/acetaminophen as directed")
        advice.append("• Use cool compresses on forehead")
        advice.append("• Wear light clothing")
    
    if 'cough' in symptoms or 'sore_throat' in symptoms:
        advice.append("\n**For Cough/Sore Throat:**")
        advice.append("• Drink warm liquids (tea, soup)")
        advice.append("• Use honey and lemon")
        advice.append("• Gargle with salt water")
    
    if 'headache' in symptoms:
        advice.append("\n**For Headache:**")
        advice.append("• Rest in a quiet, dark room")
        advice.append("• Apply cold compress to forehead")
        advice.append("• Avoid screen time")
    
    if 'nausea' in symptoms or 'vomiting' in symptoms:
        advice.append("\n**For Nausea/Vomiting:**")
        advice.append("• Eat small, frequent meals")
        advice.append("• Try ginger tea or peppermint")
        advice.append("• Avoid spicy and fatty foods")
    
    if 'diarrhea' in symptoms:
        advice.append("\n**For Diarrhea:**")
        advice.append("• Drink oral rehydration solution (ORS)")
        advice.append("• Eat BRAT diet (Banana, Rice, Applesauce, Toast)")
        advice.append("• Avoid dairy and caffeine")
    
    return "\n".join(advice)


def generate_doctor_advice(urgency: str, symptoms: List[str]) -> str:
    """
    Generate advice on when to see a doctor
    
    Args:
        urgency: Urgency level
        symptoms: Detected symptoms
        
    Returns:
        Doctor consultation advice
    """
    if urgency == 'emergency':
        return """
🚨 **SEEK IMMEDIATE MEDICAL ATTENTION**
• Go to the emergency room or call emergency services immediately
• Do not wait or try home remedies
• This could be a medical emergency requiring urgent care
        """.strip()
    
    if urgency == 'urgent':
        return """
⚠️ **See a Doctor Soon (Within 24-48 Hours)**

You should consult a healthcare provider if:
• Symptoms worsen or don't improve in 2-3 days
• You develop new concerning symptoms
• You have difficulty performing daily activities
• You have underlying health conditions

**See a doctor immediately if you experience:**
• High fever (>103°F/39.4°C) that doesn't respond to medication
• Severe pain
• Difficulty breathing
• Persistent vomiting or diarrhea leading to dehydration
• Confusion or altered consciousness
        """.strip()
    
    # Routine
    return """
📋 **Routine Consultation Recommended**

Consider seeing a doctor if:
• Symptoms persist for more than 5-7 days
• Symptoms gradually worsen
• Home remedies don't provide relief
• You have concerns about your symptoms
• You want professional medical advice

**Seek immediate care if:**
• You develop severe symptoms
• You have trouble breathing
• You experience chest pain
• You become confused or disoriented
    """.strip()


def format_symptom_name(symptom_key: str) -> str:
    """
    Convert symptom key to readable format
    
    Args:
        symptom_key: Internal symptom key (e.g., 'sore_throat')
        
    Returns:
        Formatted name (e.g., 'Sore Throat')
    """
    return symptom_key.replace('_', ' ').title()
