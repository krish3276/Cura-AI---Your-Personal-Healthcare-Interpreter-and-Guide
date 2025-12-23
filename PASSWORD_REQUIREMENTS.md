# Password Requirements Guide

## ✅ Password Validation Rules

Your password MUST meet ALL of these requirements:

### 1. Minimum Length
- **At least 8 characters**
- Example: `Test1234` ✅

### 2. Uppercase Letter
- **At least one uppercase letter (A-Z)**
- Example: `Test1234` ✅ (has 'T')

### 3. Lowercase Letter
- **At least one lowercase letter (a-z)**
- Example: `Test1234` ✅ (has 'e', 's', 't')

### 4. Number
- **At least one digit (0-9)**
- Example: `Test1234` ✅ (has '1', '2', '3', '4')

---

## ✅ Valid Password Examples

All of these passwords meet the requirements:

```
Test1234!
Admin123
Password1
MyPass99
SecureP@ss1
HelloWorld1
Welcome2024
```

---

## ❌ Invalid Password Examples

These passwords will be REJECTED:

### Too Short
```
Test12      ❌ Only 6 characters (needs 8+)
```

### No Uppercase
```
test1234    ❌ No uppercase letter
admin123    ❌ No uppercase letter
```

### No Lowercase
```
TEST1234    ❌ No lowercase letter
ADMIN123    ❌ No lowercase letter
```

### No Number
```
TestPass    ❌ No digit
AdminUser   ❌ No digit
```

---

## 🧪 Quick Test

Try these combinations in the signup form:

| Password | Valid? | Reason |
|----------|--------|--------|
| `admin` | ❌ | No uppercase, no number, too short |
| `Admin` | ❌ | No number, too short |
| `Admin123` | ✅ | Meets all requirements |
| `password1` | ❌ | No uppercase |
| `PASSWORD1` | ❌ | No lowercase |
| `Test1234` | ✅ | Meets all requirements |
| `MySecurePass1` | ✅ | Meets all requirements |

---

## 🔧 Error Messages You Might See

### Frontend Validation Errors (before sending to backend)
- "Password must be at least 8 characters"
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one number"
- "Passwords do not match"

### Backend Validation Errors (from server)
- "Validation error: Password must be at least 8 characters long"
- "Validation error: Password must contain at least one uppercase letter"
- "Validation error: Password must contain at least one lowercase letter"
- "Validation error: Password must contain at least one digit"

---

## 💡 Tips for Creating a Strong Password

1. **Use a passphrase**: `MyDog2024!` is easier to remember than `xK9#mP2$`
2. **Combine words with numbers**: `BlueSky123`, `Coffee2Go`
3. **Add special characters** (optional but recommended): `Test@123`, `Secure#Pass1`
4. **Don't use common passwords**: Avoid `Password1`, `Admin123`, `Test1234` in production

---

## 🐛 Recent Bug Fix

**Issue Fixed**: The signup form was showing a blank page when validation errors occurred.

**Root Cause**: The error response from the backend was an array of objects, which React couldn't display directly.

**Solution**: Updated error handling to properly extract and display validation error messages.

---

## 📝 Username Requirements

While we're at it, here are the username requirements:

- **Minimum 3 characters**
- **Maximum 50 characters**
- **Only letters, numbers, and underscores** (a-z, A-Z, 0-9, _)
- **Must be unique** (no two users can have the same username)

### Valid Usernames
```
john_doe ✅
admin123 ✅
User_Name ✅
test_user_1 ✅
```

### Invalid Usernames
```
ab ❌ (too short)
john-doe ❌ (contains hyphen)
user@name ❌ (contains @)
my name ❌ (contains space)
```

---

## 🎯 Complete Valid Example

Here's a complete example that will successfully create an account:

```javascript
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "MyPass123",
  "confirmPassword": "MyPass123"
}
```

This will:
- ✅ Pass frontend validation
- ✅ Pass backend validation
- ✅ Create a user account
- ✅ Store data in the database
- ✅ Show success message
- ✅ Redirect to login page

---

**Last Updated**: December 23, 2025
