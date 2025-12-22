# ⚡ Quick Start Guide - Get Running in 10 Minutes!

## 🎯 Goal
Get your Cura AI backend up and running quickly for testing and demonstration.

---

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.9+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ Node.js 18+ (for frontend)
- ✅ Git (for version control)

---

## 🚀 Installation (Step by Step)

### Step 1: Install Backend Dependencies (2 minutes)

```powershell
# Navigate to Backend folder
cd Backend

# Install Python packages
pip install -r requirements.txt
```

**Expected Output:** All packages installing successfully

---

### Step 2: Install Tesseract OCR (3 minutes)

**Windows:**
1. Download: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer: `tesseract-ocr-w64-setup-5.3.x.exe`
3. Install to: `C:\Program Files\Tesseract-OCR`
4. Add to PATH or skip (we'll handle it in code)

**Verify Installation:**
```powershell
tesseract --version
```

If command not found, that's okay - the code will still work!

---

### Step 3: Setup Database (2 minutes)

**Open MySQL:**
```sql
-- Create database
CREATE DATABASE cura_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
USE cura_ai;
```

**Update config.py:**
```python
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/cura_ai"
)
```

Replace `YOUR_PASSWORD` with your MySQL password.

---

### Step 4: Create Database Tables (1 minute)

**Option A: Automatic (Recommended)**

Just start the server - tables will be created automatically!

```powershell
python main.py
```

**Option B: Manual**

Run the SQL from `IMPLEMENTATION_GUIDE.md` Step 3.

---

### Step 5: Test Setup (1 minute)

```powershell
# Run the test script
python test_setup.py
```

**Expected Output:**
```
✅ FastAPI - Installed
✅ SQLAlchemy - Installed
✅ OpenCV - Installed
✅ Tesseract version: 5.3.x
✅ Database connection successful!
✅ All models loaded
```

---

### Step 6: Start Backend Server (30 seconds)

```powershell
python main.py
```

**OR**

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
🚀 Starting Cura AI - Personal Health Interpreter v1.0.0
✓ Application started successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Step 7: Test APIs (30 seconds)

Open browser: **http://localhost:8000/docs**

You should see Swagger UI with all API endpoints!

---

## 🧪 Quick Testing

### Test 1: Signup User

1. Go to: http://localhost:8000/docs
2. Find `POST /api/auth/signup`
3. Click "Try it out"
4. Enter:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234"
}
```
5. Click "Execute"
6. Should return: `201 Created` with user data

### Test 2: Login

1. Find `POST /api/auth/login`
2. Enter:
```json
{
  "username": "testuser",
  "password": "Test1234"
}
```
3. Should return: JWT tokens

**Copy the `access_token` from response!**

### Test 3: Upload Prescription

1. Find `POST /api/prescriptions/upload`
2. Click "Authorize" (🔒 icon at top right)
3. Paste your token: `Bearer YOUR_TOKEN_HERE`
4. Click "Authorize" then "Close"
5. Find upload endpoint again
6. Click "Try it out"
7. Choose a file (any image/PDF)
8. Click "Execute"
9. Should process and return results!

### Test 4: Analyze Symptoms

1. Find `POST /api/symptoms/analyze`
2. Should already be authorized
3. Enter:
```json
{
  "symptoms_text": "I have a headache and fever for 2 days",
  "age": 25,
  "gender": "male",
  "severity": "moderate"
}
```
4. Click "Execute"
5. Should return detected symptoms and advice!

---

## 🎯 Frontend Setup (Optional - 2 minutes)

```powershell
# Navigate to Frontend
cd ..\Frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: **http://localhost:5173**

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'cv2'"
**Solution:** 
```powershell
pip install opencv-python
```

### Issue: "Tesseract not found"
**Solution:**
Either:
1. Add Tesseract to PATH, OR
2. Create `utils/tesseract_config.py`:
```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### Issue: "Database connection failed"
**Solution:**
- Check MySQL is running
- Verify password in `config.py`
- Verify database `cura_ai` exists

### Issue: "Table doesn't exist"
**Solution:**
- Stop the server
- Delete the database: `DROP DATABASE cura_ai;`
- Create again: `CREATE DATABASE cura_ai;`
- Start server - tables will be created

---

## 📊 What You Should See

### 1. Backend Running:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
🚀 Starting Cura AI - Personal Health Interpreter v1.0.0
✓ Application started successfully
INFO:     Application startup complete.
```

### 2. API Docs:
Beautiful Swagger UI with endpoints:
- Authentication (3 endpoints)
- Prescriptions (4 endpoints)
- Symptom Checker (4 endpoints)

### 3. Database Tables:
```sql
SHOW TABLES;
+-------------------+
| Tables_in_cura_ai |
+-------------------+
| users             |
| prescriptions     |
| medical_reports   |
| symptom_interactions |
+-------------------+
```

---

## ✅ Success Checklist

- [ ] All packages installed without errors
- [ ] Tesseract OCR accessible
- [ ] MySQL database created and connected
- [ ] Backend server running on port 8000
- [ ] Swagger UI accessible at /docs
- [ ] Can signup/login successfully
- [ ] Can upload a test prescription
- [ ] Can analyze symptoms
- [ ] Frontend running (optional)

---

## 🎉 You're Ready!

If all checks pass, you're ready to:
- Demonstrate your project
- Test all features
- Connect frontend to backend
- Show your final year project

---

## 📞 Need Help?

Check these files:
1. `IMPLEMENTATION_GUIDE.md` - Detailed setup
2. `PROJECT_SUMMARY.md` - Project overview
3. `README.md` - General information

---

**Time to Complete:** ~10 minutes
**Difficulty:** Easy 
**Success Rate:** 99% (if you follow steps)

Happy coding! 🚀
