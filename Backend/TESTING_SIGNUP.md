# Test Signup and Auth Flow

## Quick Test Commands

### 1. Test if backend is accessible:
```powershell
curl http://localhost:8000/health
```

**Expected**: `{"status":"healthy",...}`

### 2. Test signup endpoint:
```powershell
$headers = @{"Content-Type"="application/json"}
$body = '{"username":"testuser123","email":"test@example.com","password":"Test12345"}'
Invoke-RestMethod -Uri http://localhost:8000/api/auth/signup -Method POST -Headers $headers -Body $body
```

**Expected**: `{"success":true,"message":"User registered successfully",...}`

### 3. Test login endpoint:
```powershell
$headers = @{"Content-Type"="application/json"}
$body = '{"username":"testuser123","password":"Test12345"}'
Invoke-RestMethod -Uri http://localhost:8000/api/auth/login -Method POST -Headers $headers -Body $body
```

**Expected**: `{"success":true,"data":{"access_token":"...",...}}`

---

## Frontend Testing Checklist

### Open Browser Console (F12) and test:

1. **Go to**: http://localhost:5173/signup

2. **Fill the form**:
   - Username: `testuser456`
   - Email: `test2@example.com`
   - Password: `Test12345`
   - Confirm Password: `Test12345`

3. **Click "Sign Up"**

4. **Check Console Output** - You should see:
   ```
   Submitting signup to: http://localhost:8000/api/auth/signup
   Signup data: {username: "testuser456", email: "test2@example.com"}
   Signup successful: {...}
   ```

5. **Check for Errors**:
   - ❌ **"Cannot connect to server"** → Backend not running
   - ❌ **"Username already registered"** → User exists (try different username)
   - ❌ **Network error** → CORS issue or wrong port
   - ✅ **Success message** → Signup worked!

---

## Common Issues & Fixes

### Issue 1: "Cannot connect to server"
**Cause**: Backend not running or on wrong port

**Fix**:
```powershell
cd Backend
python main.py
```
Check output shows: `INFO: Uvicorn running on http://0.0.0.0:8000`

---

### Issue 2: No console output at all
**Cause**: Frontend not calling backend

**Check**:
1. Open SignUp.jsx
2. Verify line ~50 calls `authService.signup()`
3. Verify api.js has `baseURL: 'http://localhost:8000/api'`

---

### Issue 3: CORS error in console
**Error**: `Access to fetch at 'http://localhost:8000' ... has been blocked by CORS`

**Fix**: Already configured in backend config.py:
```python
CORS_ORIGINS: list = [
    "http://localhost:5173",  # Vite default
    ...
]
```

If using different port, add it to config.py

---

### Issue 4: "Username already registered"
**Cause**: User already exists in database

**Fix Option 1** - Use different username
**Fix Option 2** - Clear database:
```sql
USE cura_ai;
DELETE FROM users WHERE username = 'testuser123';
```

---

## Verify Database Storage

### Check if user was saved:

```sql
USE cura_ai;

-- See all users
SELECT id, username, email, is_active, created_at 
FROM users 
ORDER BY created_at DESC;
```

**Expected**: Your test user should appear in the list

---

## Full Test Script (PowerShell)

Run this to test the complete flow:

```powershell
# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri http://localhost:8000/health
    Write-Host "✓ Backend is running: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not accessible!" -ForegroundColor Red
    exit 1
}

# Test 2: Signup
Write-Host "`nTest 2: Signup" -ForegroundColor Cyan
$timestamp = Get-Date -Format "MMddHHmmss"
$testUser = "testuser$timestamp"
$signupBody = @{
    username = $testUser
    email = "$testUser@example.com"
    password = "Test12345"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri http://localhost:8000/api/auth/signup `
                                 -Method POST `
                                 -ContentType "application/json" `
                                 -Body $signupBody
    Write-Host "✓ Signup successful: $($signup.message)" -ForegroundColor Green
    Write-Host "  User ID: $($signup.data.id)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Login
Write-Host "`nTest 3: Login" -ForegroundColor Cyan
$loginBody = @{
    username = $testUser
    password = "Test12345"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri http://localhost:8000/api/auth/login `
                                -Method POST `
                                -ContentType "application/json" `
                                -Body $loginBody
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Access Token: $($login.data.access_token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ All tests passed!" -ForegroundColor Green
Write-Host "Backend is working correctly." -ForegroundColor Cyan
```

Save this as `test_auth.ps1` and run:
```powershell
cd Backend
.\test_auth.ps1
```

---

## What to Share if Still Not Working

If signup still doesn't work after these tests, share:

1. **Browser console output** (F12 → Console tab)
2. **Backend terminal output** when you click signup
3. **Network tab** (F12 → Network tab → look for signup request, click it, check Response)
4. **Result of test script** above

This will show exactly where the failure is happening!
