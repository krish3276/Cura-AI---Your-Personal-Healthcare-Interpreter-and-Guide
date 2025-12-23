"""
Test script to verify backend and database connection
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✓ Backend is running on http://localhost:8000")
            return True
        else:
            print(f"✗ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Backend is NOT running. Please start it with: python main.py")
        return False
    except Exception as e:
        print(f"✗ Error connecting to backend: {e}")
        return False

def test_signup():
    """Test signup endpoint"""
    test_user = {
        "username": f"testuser_{int(requests.get('http://worldtimeapi.org/api/timezone/Etc/UTC').json()['unixtime'])}",
        "email": f"test_{int(requests.get('http://worldtimeapi.org/api/timezone/Etc/UTC').json()['unixtime'])}@example.com",
        "password": "Test1234!"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nSignup Response Status: {response.status_code}")
        print(f"Signup Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("✓ Signup endpoint is working correctly")
            return True
        else:
            print(f"✗ Signup failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error testing signup: {e}")
        return False

def test_database():
    """Check database connection through backend"""
    try:
        # Try to create a test user to verify database is working
        import sys
        import os
        
        # Add backend directory to path
        sys.path.insert(0, os.path.dirname(__file__))
        
        from database import engine
        from sqlalchemy import text
        
        # Test database connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection is working")
            return True
            
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        print("\nPlease ensure:")
        print("1. MySQL is running on port 3307")
        print("2. Database 'cura_ai' exists")
        print("3. User 'root' with password 'password' has access")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("CURA AI BACKEND DIAGNOSTIC TEST")
    print("=" * 60)
    
    print("\n1. Testing Database Connection...")
    db_ok = test_database()
    
    print("\n2. Testing Backend Server...")
    backend_ok = test_backend_health()
    
    if backend_ok:
        print("\n3. Testing Signup Endpoint...")
        signup_ok = test_signup()
    else:
        print("\n⚠ Skipping signup test - backend is not running")
        signup_ok = False
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Database: {'✓ OK' if db_ok else '✗ FAILED'}")
    print(f"Backend:  {'✓ OK' if backend_ok else '✗ FAILED'}")
    print(f"Signup:   {'✓ OK' if signup_ok else '✗ FAILED'}")
    print("=" * 60)
    
    if db_ok and backend_ok and signup_ok:
        print("\n✓ All tests passed! Your backend is ready.")
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
