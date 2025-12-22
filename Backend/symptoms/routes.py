"""
Symptom Checker Routes

Handles symptom analysis and health recommendations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
from models import User, SymptomInteraction
from schemas import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
    SymptomInteractionListItem
)
from utils.dependencies import get_current_user
from utils.responses import success_response, error_response
from utils.symptom_analyzer import (
    detect_symptoms,
    analyze_symptoms,
    generate_home_care_advice,
    generate_doctor_advice,
    format_symptom_name
)

router = APIRouter()


@router.post("/analyze", response_model=dict, status_code=status.HTTP_201_CREATED)
async def analyze_symptoms_endpoint(
    request: SymptomAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze user symptoms and provide health recommendations
    
    **How it works:**
    1. Detects symptoms from natural language input
    2. Matches symptoms with medical conditions database
    3. Determines urgency level (routine, urgent, emergency)
    4. Generates home care advice
    5. Provides guidance on when to see a doctor
    
    **Request Body:**
    - symptoms_text: Describe your symptoms in your own words
    - age: Your age (optional, helps with analysis)
    - gender: male/female/other (optional)
    - symptom_duration: How long you've had symptoms (optional)
    - severity: mild/moderate/severe (optional)
    
    **Returns:**
    - Detected symptoms
    - Possible conditions
    - Home care advice
    - Doctor consultation guidance
    - Urgency level
    
    **⚠️ Disclaimer:**
    This is an AI-based tool for informational purposes only.
    It does NOT replace professional medical advice.
    Always consult a healthcare provider for serious concerns.
    """
    
    # Detect symptoms from text
    detected_symptoms_keys = detect_symptoms(request.symptoms_text)
    
    if not detected_symptoms_keys:
        # Still save the interaction even if no symptoms detected
        interaction = SymptomInteraction(
            user_id=current_user.id,
            symptoms_text=request.symptoms_text,
            age=request.age,
            gender=request.gender,
            symptom_duration=request.symptom_duration,
            severity=request.severity,
            processing_status="completed",
            urgency_level="routine",
            home_care_advice="No specific symptoms detected. If you're feeling unwell, please consult a healthcare provider.",
            when_to_see_doctor="Consult a doctor if symptoms develop or worsen."
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        
        return success_response(
            message="Analysis completed",
            data={
                "id": interaction.id,
                "message": "We couldn't detect specific symptoms. Please try describing your symptoms in more detail.",
                "detected_symptoms": [],
                "possible_conditions": [],
                "home_care_advice": interaction.home_care_advice,
                "when_to_see_doctor": interaction.when_to_see_doctor,
                "urgency_level": "routine",
                "created_at": interaction.created_at
            }
        )
    
    # Analyze symptoms
    analysis_result = analyze_symptoms(detected_symptoms_keys, request.age)
    
    # Format detected symptoms for display
    detected_symptoms_formatted = [
        format_symptom_name(symptom) for symptom in detected_symptoms_keys
    ]
    
    # Extract possible conditions
    possible_conditions = []
    if analysis_result.get('possible_conditions'):
        for condition in analysis_result['possible_conditions']:
            if isinstance(condition, dict):
                possible_conditions.append({
                    'name': condition['condition'],
                    'match_score': f"{condition['match_score']*100:.0f}%",
                    'description': condition['description']
                })
            else:
                possible_conditions.append({'name': str(condition)})
    
    # Generate advice
    home_care = generate_home_care_advice(
        detected_symptoms_keys,
        analysis_result.get('possible_conditions', [])
    )
    
    doctor_advice = generate_doctor_advice(
        analysis_result['urgency_level'],
        detected_symptoms_keys
    )
    
    # Save to database
    interaction = SymptomInteraction(
        user_id=current_user.id,
        symptoms_text=request.symptoms_text,
        detected_symptoms=json.dumps(detected_symptoms_formatted),
        age=request.age,
        gender=request.gender,
        symptom_duration=request.symptom_duration,
        severity=request.severity,
        possible_conditions=json.dumps(possible_conditions),
        confidence_score=analysis_result.get('confidence_score', 0.0),
        home_care_advice=home_care,
        when_to_see_doctor=doctor_advice,
        urgency_level=analysis_result['urgency_level'],
        processing_status="completed"
    )
    
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    
    return success_response(
        message="Symptom analysis completed successfully",
        data={
            "id": interaction.id,
            "symptoms_text": interaction.symptoms_text,
            "detected_symptoms": detected_symptoms_formatted,
            "possible_conditions": possible_conditions,
            "confidence_score": interaction.confidence_score,
            "home_care_advice": home_care,
            "when_to_see_doctor": doctor_advice,
            "urgency_level": interaction.urgency_level,
            "created_at": interaction.created_at,
            "disclaimer": "⚠️ This is for informational purposes only. Please consult a healthcare professional for medical advice."
        }
    )


@router.get("/history", response_model=dict)
async def get_symptom_history(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's symptom check history
    
    **Query Parameters:**
    - skip: Number of records to skip (for pagination)
    - limit: Maximum number of records to return
    
    **Returns:**
    - List of previous symptom interactions
    """
    
    interactions = db.query(SymptomInteraction)\
        .filter(SymptomInteraction.user_id == current_user.id)\
        .order_by(SymptomInteraction.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    history_list = []
    for interaction in interactions:
        history_list.append({
            "id": interaction.id,
            "symptoms_text": interaction.symptoms_text,
            "urgency_level": interaction.urgency_level,
            "created_at": interaction.created_at
        })
    
    return success_response(
        message=f"Retrieved {len(history_list)} symptom check(s)",
        data={
            "history": history_list,
            "total": len(history_list),
            "skip": skip,
            "limit": limit
        }
    )


@router.get("/{interaction_id}", response_model=dict)
async def get_symptom_detail(
    interaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific symptom check
    
    **Path Parameters:**
    - interaction_id: ID of the symptom interaction
    
    **Returns:**
    - Complete details of the symptom analysis
    """
    
    interaction = db.query(SymptomInteraction)\
        .filter(
            SymptomInteraction.id == interaction_id,
            SymptomInteraction.user_id == current_user.id
        )\
        .first()
    
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom check not found"
        )
    
    # Parse JSON fields
    detected_symptoms = json.loads(interaction.detected_symptoms) if interaction.detected_symptoms else []
    possible_conditions = json.loads(interaction.possible_conditions) if interaction.possible_conditions else []
    
    return success_response(
        message="Symptom check retrieved successfully",
        data={
            "id": interaction.id,
            "symptoms_text": interaction.symptoms_text,
            "detected_symptoms": detected_symptoms,
            "possible_conditions": possible_conditions,
            "confidence_score": interaction.confidence_score,
            "home_care_advice": interaction.home_care_advice,
            "when_to_see_doctor": interaction.when_to_see_doctor,
            "urgency_level": interaction.urgency_level,
            "age": interaction.age,
            "gender": interaction.gender,
            "symptom_duration": interaction.symptom_duration,
            "severity": interaction.severity,
            "created_at": interaction.created_at
        }
    )


@router.delete("/{interaction_id}", response_model=dict)
async def delete_symptom_check(
    interaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a symptom check from history
    
    **Path Parameters:**
    - interaction_id: ID of the symptom check to delete
    
    **Returns:**
    - Confirmation message
    """
    
    interaction = db.query(SymptomInteraction)\
        .filter(
            SymptomInteraction.id == interaction_id,
            SymptomInteraction.user_id == current_user.id
        )\
        .first()
    
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom check not found"
        )
    
    db.delete(interaction)
    db.commit()
    
    return success_response(
        message="Symptom check deleted successfully",
        data={"id": interaction_id}
    )
