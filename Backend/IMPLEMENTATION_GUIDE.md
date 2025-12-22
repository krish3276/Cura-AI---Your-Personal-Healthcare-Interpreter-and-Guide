# 🚀 Backend Feature Implementation - Setup Guide

## What We Just Built

We've implemented **2 major features** for your Cura AI project:

### ✅ Feature 1: Prescription Upload + OCR Processing
- Upload prescription images (JPG, PNG) or PDFs
- Extract text using Tesseract OCR
- Identify medicine names and dosages
- Generate user-friendly explanations
- Store everything in MySQL database

### ✅ Feature 2: Symptom Checker (AI/NLP)
- Analyze symptoms from natural language
- Detect symptoms using keyword matching
- Match symptoms with medical conditions
- Determine urgency level (routine/urgent/emergency)
- Provide home care advice
- Guidance on when to see a doctor

---

## 📦 Installation Steps

### Step 1: Install Python Dependencies

Navigate to the Backend folder and run:

```bash
cd Backend
pip install -r requirements.txt
```

This will install all new packages including:
- `pytesseract` - OCR engine
- `opencv-python` - Image processing
- `PyPDF2` - PDF text extraction
- `numpy` - Numerical operations
- `Pillow` - Image handling

### Step 2: Install Tesseract OCR Engine

**For Windows:**

1. Download Tesseract installer from:
   https://github.com/UB-Mannheim/tesseract/wiki

2. Run the installer (tesseract-ocr-w64-setup-5.3.x.exe)

3. During installation, note the installation path (usually `C:\Program Files\Tesseract-OCR`)

4. Add Tesseract to your Python code OR system PATH:

   **Option A:** Add to Windows PATH environment variable:
   - Right-click "This PC" → Properties → Advanced System Settings
   - Click "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\Tesseract-OCR`
   - Click OK on all dialogs
   - Restart PowerShell/Terminal

   **Option B:** Add to Python code (temporary fix):
   Create a file `Backend/utils/tesseract_config.py`:
   ```python
   import pytesseract
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

**For Linux:**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

**For Mac:**
```bash
brew install tesseract
```

### Step 3: Update Database Schema

The new models need to be added to your MySQL database.

**Option 1: Drop and Recreate (Development Only - Loses Data)**
```python
# In Python shell or create a script
from database import engine, Base
from models import User, Prescription, MedicalReport, SymptomInteraction

# WARNING: This deletes all data
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
```

**Option 2: Run MySQL Commands (Recommended)**

Connect to MySQL and run:

```sql
USE cura_ai;

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT,
    extracted_text TEXT,
    medicines TEXT,
    simplified_explanation TEXT,
    processing_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Create medical_reports table
CREATE TABLE IF NOT EXISTS medical_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    report_title VARCHAR(255),
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT,
    extracted_text TEXT,
    detected_values TEXT,
    abnormalities_detected TEXT,
    risk_level VARCHAR(50),
    ai_summary TEXT,
    recommendations TEXT,
    processing_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Create symptom_interactions table
CREATE TABLE IF NOT EXISTS symptom_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    symptoms_text TEXT NOT NULL,
    detected_symptoms TEXT,
    age INT,
    gender VARCHAR(20),
    symptom_duration VARCHAR(100),
    severity VARCHAR(50),
    possible_conditions TEXT,
    confidence_score FLOAT,
    home_care_advice TEXT,
    when_to_see_doctor TEXT,
    urgency_level VARCHAR(50),
    processing_status VARCHAR(50) DEFAULT 'completed',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);
```

### Step 4: Start the Backend Server

```bash
cd Backend
python main.py
```

Or using uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: **http://localhost:8000**

---

## 📡 API Endpoints Available

### Authentication (Already Working)
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Prescriptions (NEW)
- `POST /api/prescriptions/upload` - Upload prescription
- `GET /api/prescriptions/list` - Get all prescriptions
- `GET /api/prescriptions/{id}` - Get prescription details
- `DELETE /api/prescriptions/{id}` - Delete prescription

### Symptom Checker (NEW)
- `POST /api/symptoms/analyze` - Analyze symptoms
- `GET /api/symptoms/history` - Get symptom history
- `GET /api/symptoms/{id}` - Get symptom detail
- `DELETE /api/symptoms/{id}` - Delete symptom check

---

## 🧪 Testing the APIs

### Using FastAPI Swagger UI (Recommended for Learning)

1. Start the backend server
2. Open browser: http://localhost:8000/docs
3. You'll see all API endpoints with "Try it out" buttons
4. Test each endpoint interactively

### Using Postman or cURL

**Example 1: Upload Prescription**
```bash
curl -X POST "http://localhost:8000/api/prescriptions/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/prescription.jpg"
```

**Example 2: Analyze Symptoms**
```bash
curl -X POST "http://localhost:8000/api/symptoms/analyze" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms_text": "I have a headache and fever since 2 days",
    "age": 25,
    "gender": "male",
    "severity": "moderate"
  }'
```

---

## 🔍 How Each Feature Works

### Prescription Processing Flow:

1. **Upload** → User uploads image/PDF
2. **Save** → File saved to `uploads/prescriptions/`
3. **Preprocess** → Image enhanced using OpenCV
4. **OCR** → Text extracted using Tesseract
5. **Parse** → Medicines identified from text
6. **Explain** → Simple explanation generated
7. **Store** → Everything saved to MySQL
8. **Return** → JSON response sent to frontend

### Symptom Analysis Flow:

1. **Input** → User describes symptoms in plain text
2. **Detect** → Keywords matched against symptom database
3. **Analyze** → Symptoms matched with conditions
4. **Score** → Confidence calculated based on matches
5. **Urgency** → Determines if routine/urgent/emergency
6. **Advice** → Generates home care tips
7. **Store** → Saves interaction to database
8. **Return** → Complete analysis sent to frontend

---

## 📁 New Files Created

```
Backend/
├── prescription/
│   └── routes.py          # Prescription API endpoints
├── symptoms/
│   └── routes.py          # Symptom checker endpoints
├── utils/
│   ├── ocr_processor.py   # OCR utilities
│   └── symptom_analyzer.py # NLP analysis
├── uploads/
│   └── prescriptions/     # Uploaded files storage
├── models.py              # Updated with 3 new models
├── schemas.py             # Updated with new schemas
└── requirements.txt       # Updated dependencies
```

---

## ⚠️ Troubleshooting

### Issue: Tesseract not found
**Solution:** Install Tesseract OCR and add to PATH (see Step 2)

### Issue: Database tables not created
**Solution:** Run the SQL commands from Step 3

### Issue: File upload fails
**Solution:** Check `uploads/prescriptions/` folder exists and has write permissions

### Issue: OCR returns no text
**Solution:** 
- Ensure image is clear and readable
- Try preprocessing the image manually
- Check Tesseract installation

### Issue: Import errors
**Solution:** Make sure all packages are installed:
```bash
pip install -r requirements.txt
```

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Set up Tesseract OCR
3. ✅ Create database tables
4. ✅ Test APIs using /docs
5. 🔄 Connect frontend to new APIs
6. 🔄 Add medical report analyzer (similar to prescription)
7. 🔄 Integrate AI models (OpenAI, Gemini) for better analysis
8. 🔄 Add text-to-speech feature

---

## 💡 Pro Tips

1. **Test thoroughly**: Use the Swagger UI at `/docs` to test each endpoint
2. **Check logs**: Look at console output for errors
3. **Validate data**: Test with different types of prescriptions
4. **Error handling**: The code handles errors gracefully
5. **Security**: JWT authentication protects all routes

---

## 📚 Learning Resources

- **Tesseract OCR**: https://github.com/tesseract-ocr/tesseract
- **OpenCV**: https://opencv.org/
- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://www.sqlalchemy.org/

---

## 🎓 What You Learned

1. ✅ SQLAlchemy relationships (One-to-Many)
2. ✅ File upload handling in FastAPI
3. ✅ Image preprocessing with OpenCV
4. ✅ OCR text extraction
5. ✅ NLP keyword matching
6. ✅ JSON data storage in MySQL
7. ✅ API design best practices
8. ✅ Error handling and validation

---

**Need Help?** Check the code comments - every function is well-documented!

Good luck with your final year project! 🚀
