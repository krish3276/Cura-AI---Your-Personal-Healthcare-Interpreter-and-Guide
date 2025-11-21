"""
Standardized response utilities
"""
from typing import Any, Optional
from datetime import datetime


def success_response(
    message: str,
    data: Optional[Any] = None,
    status_code: int = 200
) -> dict:
    """
    Create standardized success response
    
    Args:
        message: Success message
        data: Response data payload
        status_code: HTTP status code
        
    Returns:
        Standardized success response dictionary
    """
    response = {
        "success": True,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if data is not None:
        response["data"] = data
    
    return response


def error_response(
    message: str,
    error: Optional[str] = None,
    status_code: int = 400
) -> dict:
    """
    Create standardized error response
    
    Args:
        message: Error message
        error: Detailed error information
        status_code: HTTP status code
        
    Returns:
        Standardized error response dictionary
    """
    response = {
        "success": False,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if error is not None:
        response["error"] = error
    
    return response
