# Cura AI Backend - Installation & Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9+** (Download from [python.org](https://www.python.org/downloads/))
- **MySQL 8.0+** (Download from [mysql.com](https://dev.mysql.com/downloads/))
- **pip** (Python package manager - comes with Python)

---

## 🚀 Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup MySQL Database

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE cura_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "Create New Schema" button
4. Name it `cura_ai`
5. Click Apply

### 5. Configure Environment Variables

Copy the example environment file:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/cura_ai
SECRET_KEY=generate-a-secure-random-key-here
DEBUG=False
```

**Generate a secure SECRET_KEY:**
```bash
# Windows PowerShell
python -c "import secrets; print(secrets.token_hex(32))"

# Linux/Mac (or use openssl)
openssl rand -hex 32
```

---

## ▶️ Running the Application

### Start the Backend Server
```bash
# Development mode (auto-reload on code changes)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Alternative: Run with Python directly
```bash
python main.py
```

The server will start at: **http://localhost:8000**

---

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

Save the `access_token` from the response.

### 4. Access Protected Dashboard
```bash
curl http://localhost:8000/api/auth/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── database.py             # Database configuration and session management
├── models.py               # SQLAlchemy database models
├── schemas.py              # Pydantic validation schemas
├── config.py               # Application configuration
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── auth/
│   ├── routes.py          # Authentication routes (signup, login, dashboard)
│   ├── hashing.py         # Password hashing utilities (bcrypt)
│   └── jwt_handler.py     # JWT token creation and validation
└── utils/
    ├── dependencies.py     # FastAPI dependencies (get current user)
    └── responses.py        # Standardized API responses
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Root endpoint / Welcome message | No |
| GET | `/health` | Health check | No |
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT tokens | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/auth/dashboard` | Access user dashboard | Yes |

---

## 🔒 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Register** a user via `/api/auth/signup`
2. **Login** via `/api/auth/login` to receive:
   - `access_token` (expires in 5 hours)
   - `refresh_token` (expires in 7 days)
3. **Include token** in protected requests:
   ```
   Authorization: Bearer <your_access_token>
   ```

---

## 🛠️ Troubleshooting

### Database Connection Error
```
Error: Can't connect to MySQL server
```
**Solution**: Verify MySQL is running and credentials in `.env` are correct

### Module Not Found Error
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Install dependencies with `pip install -r requirements.txt`

### Port Already in Use
```
Error: Port 8000 is already in use
```
**Solution**: Change port: `uvicorn main:app --port 8001`

### Token Expired
```
401 Unauthorized: Could not validate credentials
```
**Solution**: Login again to get a new access token

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong SECRET_KEY** - Generate with `openssl rand -hex 32`
3. **Change default passwords** - Update MySQL root password
4. **Use HTTPS in production** - Configure SSL/TLS certificates
5. **Enable CORS properly** - Update `CORS_ORIGINS` in `config.py` for production

---

## 📊 Database Schema

The `users` table structure:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

The tables are **auto-created** when you start the application for the first time!

---

## 🎯 Next Steps

1. **Test all endpoints** using Swagger UI at `/docs`
2. **Integrate with frontend** - Update CORS origins if needed
3. **Add more features** - Extend models and routes as needed
4. **Deploy to production** - Consider using Docker, AWS, or Heroku

---

## 📞 Support

For issues or questions about Cura AI:
- Check the API documentation at `/docs`
- Review error messages in terminal output
- Verify database connection and environment variables

---

**🎉 Your Cura AI Backend is Ready!**

Access the API documentation at: http://localhost:8000/docs
