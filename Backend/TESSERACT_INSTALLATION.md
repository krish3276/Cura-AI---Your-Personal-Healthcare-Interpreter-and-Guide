# Tesseract OCR Installation Guide

Tesseract OCR is required for the Prescription Upload feature to extract text from prescription images.

## 📥 Installation Instructions

### **For Windows (Recommended):**

1. **Download Tesseract Installer:**
   - Visit: https://github.com/UB-Mannheim/tesseract/wiki
   - Download the latest Windows installer (e.g., `tesseract-ocr-w64-setup-5.3.3.20231005.exe`)

2. **Run the Installer:**
   - Double-click the downloaded `.exe` file
   - **Important:** During installation, note the installation path (usually `C:\Program Files\Tesseract-OCR`)
   - Make sure to check "Add to PATH" if the option is available

3. **Verify Installation:**
   ```powershell
   tesseract --version
   ```
   If you see version information, Tesseract is installed correctly!

4. **Configure Path (if needed):**
   - If the command above fails, you need to configure the path manually
   - Open: `Backend/utils/ocr_processor.py`
   - Find line ~26 (near the top of the file)
   - **Uncomment and update this line:**
     ```python
     TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
     ```
   - Change the path to match where you installed Tesseract

---

### **For macOS:**

1. **Install via Homebrew:**
   ```bash
   brew install tesseract
   ```

2. **Verify Installation:**
   ```bash
   tesseract --version
   ```

3. **Configure Path (usually not needed):**
   - If OCR doesn't work, edit `Backend/utils/ocr_processor.py`
   - Set: `TESSERACT_PATH = '/usr/local/bin/tesseract'`

---

### **For Linux (Ubuntu/Debian):**

1. **Install via apt:**
   ```bash
   sudo apt update
   sudo apt install tesseract-ocr
   ```

2. **Verify Installation:**
   ```bash
   tesseract --version
   ```

3. **Configure Path (usually not needed):**
   - If OCR doesn't work, edit `Backend/utils/ocr_processor.py`
   - Set: `TESSERACT_PATH = '/usr/bin/tesseract'`

---

## ✅ Testing Tesseract

After installation, restart your backend server and test:

1. **Stop the backend** (Ctrl+C in the terminal)

2. **Restart the backend:**
   ```powershell
   python main.py
   ```

3. **Test via API:**
   - Go to http://localhost:8000/docs
   - Try the `/api/prescription/upload` endpoint
   - Upload a prescription image

4. **Check logs:**
   - If Tesseract is working, you'll see extracted text
   - If not working, check the error message and verify the path in `ocr_processor.py`

---

## 🔧 Configuration File Location

**File to edit:** `Backend/utils/ocr_processor.py`

**Lines to modify:** Around line 26-27

**Before:**
```python
TESSERACT_PATH = None

# Uncomment and set the path after installing Tesseract:
# TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**After (Windows):**
```python
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Uncomment and set the path after installing Tesseract:
# TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

---

## 🚨 Troubleshooting

### "tesseract is not recognized as a command"
- Tesseract is not in your system PATH
- **Solution:** Set `TESSERACT_PATH` manually in `ocr_processor.py`

### "Failed to extract text from image"
- Image quality might be too low
- Try a clearer, higher resolution image
- Ensure the prescription is well-lit and not blurry

### OCR returns gibberish
- Try rotating the image to be right-side up
- Ensure the image is not upside down or sideways
- Use a scanner instead of a phone camera if possible

---

## 📝 Note

Without Tesseract installed, the prescription upload feature will still work but will use **mock data** for demonstration purposes. Install Tesseract to get real OCR functionality!
