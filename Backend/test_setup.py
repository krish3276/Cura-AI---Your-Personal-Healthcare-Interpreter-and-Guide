"""
Quick Test Script for Backend Features

Run this after installing dependencies to verify setup
"""

def test_imports():
    """Test if all required packages are installed"""
    print("🧪 Testing package imports...\n")
    
    packages = {
        'fastapi': 'FastAPI',
        'sqlalchemy': 'SQLAlchemy',
        'pymysql': 'PyMySQL',
        'cv2': 'OpenCV',
        'numpy': 'NumPy',
        'pytesseract': 'Tesseract',
        'PyPDF2': 'PyPDF2',
        'PIL': 'Pillow'
    }
    
    results = []
    for package, name in packages.items():
        try:
            __import__(package)
            print(f"✅ {name:20} - Installed")
            results.append(True)
        except ImportError:
            print(f"❌ {name:20} - NOT INSTALLED")
            results.append(False)
    
    print(f"\n{'='*50}")
    if all(results):
        print("✅ All packages installed successfully!")
    else:
        print("⚠️  Some packages missing. Run: pip install -r requirements.txt")
    print(f"{'='*50}\n")
    
    return all(results)


def test_tesseract():
    """Test if Tesseract OCR is accessible"""
    print("🔍 Testing Tesseract OCR...\n")
    
    try:
        import pytesseract
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version: {version}")
        return True
    except Exception as e:
        print(f"❌ Tesseract not found: {e}")
        print("\n📝 Install Tesseract OCR:")
        print("   Windows: https://github.com/UB-Mannheim/tesseract/wiki")
        print("   Linux: sudo apt install tesseract-ocr")
        print("   Mac: brew install tesseract")
        return False


def test_database_connection():
    """Test database connection"""
    print("\n🗄️  Testing database connection...\n")
    
    try:
        from database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n📝 Make sure MySQL is running and config.py has correct credentials")
        return False


def test_models():
    """Test if models are properly defined"""
    print("\n📦 Testing database models...\n")
    
    try:
        from models import User, Prescription, MedicalReport, SymptomInteraction
        print("✅ User model loaded")
        print("✅ Prescription model loaded")
        print("✅ MedicalReport model loaded")
        print("✅ SymptomInteraction model loaded")
        return True
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        return False


def test_routes():
    """Test if routes are properly defined"""
    print("\n🛣️  Testing API routes...\n")
    
    try:
        from prescription.routes import router as prescription_router
        from symptoms.routes import router as symptoms_router
        print("✅ Prescription routes loaded")
        print("✅ Symptoms routes loaded")
        return True
    except Exception as e:
        print(f"❌ Route loading failed: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*50)
    print("    CURA AI BACKEND - SETUP VERIFICATION")
    print("="*50 + "\n")
    
    results = []
    
    results.append(test_imports())
    results.append(test_tesseract())
    results.append(test_database_connection())
    results.append(test_models())
    results.append(test_routes())
    
    print("\n" + "="*50)
    print("           FINAL RESULTS")
    print("="*50)
    
    if all(results):
        print("\n🎉 All tests passed! You're ready to start the server!")
        print("\n▶️  Run: python main.py")
        print("📚 API Docs: http://localhost:8000/docs")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")
        print("\n📖 See IMPLEMENTATION_GUIDE.md for setup instructions")
    
    print("\n" + "="*50 + "\n")


if __name__ == "__main__":
    main()
