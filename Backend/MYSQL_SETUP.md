# MySQL Configuration for Cura AI Backend

## ✅ Current Setup

Your backend is now successfully connected to **MySQL via XAMPP**!

### Connection Details

```
Host: localhost
Port: 3307
Database: cura_ai
User: root
Password: (empty)
```

### Database URL Format
```
DATABASE_URL=mysql+pymysql://root:@localhost:3307/cura_ai
```

## 📊 Database Structure

### Tables Created:
- **users** - Stores user authentication and profile data

### Users Table Schema:
```sql
id              INT(11)         PRIMARY KEY AUTO_INCREMENT
username        VARCHAR(50)     UNIQUE NOT NULL
email           VARCHAR(100)    UNIQUE NOT NULL
hashed_password VARCHAR(255)    NOT NULL
is_active       TINYINT(1)      NOT NULL DEFAULT 1
created_at      DATETIME        DEFAULT NOW()
updated_at      DATETIME        NULL
```

### Indexes:
- UNIQUE INDEX on `username`
- UNIQUE INDEX on `email`
- INDEX on `id`

## 🔧 XAMPP Configuration

### Your XAMPP Setup:
- MySQL running on port: **3307** (non-standard)
- Default MySQL port is 3306, but yours is on 3307

### Access MySQL in XAMPP:
1. Open XAMPP Control Panel
2. Start MySQL service
3. Click "Admin" to open phpMyAdmin
4. Database: `cura_ai` will be visible

## 🔐 Security Notes for Production

### Current Setup (Development):
- ✅ User: root
- ✅ Password: empty
- ✅ Host: localhost
- ✅ Port: 3307

### For Production (Recommended):
Create a dedicated MySQL user:

```sql
-- Connect to MySQL as root
CREATE USER 'cura_ai_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON cura_ai.* TO 'cura_ai_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update `.env`:
```
DATABASE_URL=mysql+pymysql://cura_ai_user:strong_password_here@localhost:3307/cura_ai
```

## 📝 Testing MySQL Connection

### Using Python:
```python
import pymysql

conn = pymysql.connect(
    host='localhost',
    port=3307,
    user='root',
    password='',
    database='cura_ai'
)

cursor = conn.cursor()
cursor.execute('SELECT * FROM users')
users = cursor.fetchall()
print(users)
conn.close()
```

### Using PowerShell:
```powershell
# Test connection
python -c "import pymysql; conn = pymysql.connect(host='localhost', port=3307, user='root', password='', database='cura_ai'); print('Connected!'); conn.close()"

# View users
python -c "import pymysql; conn = pymysql.connect(host='localhost', port=3307, user='root', password='', database='cura_ai'); cursor = conn.cursor(); cursor.execute('SELECT * FROM users'); print(cursor.fetchall()); conn.close()"
```

## 🔄 Switching Between SQLite and MySQL

### To use SQLite (for testing):
```env
DATABASE_URL=sqlite:///./cura_ai.db
```

### To use MySQL (current setup):
```env
DATABASE_URL=mysql+pymysql://root:@localhost:3307/cura_ai
```

Just restart the server after changing `.env` file.

## 🚀 Server Status

**Current Configuration:**
- ✅ Server running on: http://localhost:8000
- ✅ Database: MySQL (XAMPP port 3307)
- ✅ Tables: Auto-created on startup
- ✅ Authentication: JWT with bcrypt
- ✅ All endpoints working

## 📡 API Endpoints (All Working with MySQL)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | GET | No | Root/Welcome |
| `/health` | GET | No | Health check |
| `/api/auth/signup` | POST | No | Register user |
| `/api/auth/login` | POST | No | Login & get tokens |
| `/api/auth/me` | GET | Yes | Get user info |
| `/api/auth/dashboard` | GET | Yes | User dashboard |

## 🎯 What Changed

1. ✅ Database connection switched from SQLite to MySQL
2. ✅ `.env` file updated with MySQL connection string
3. ✅ `cura_ai` database created in MySQL
4. ✅ `users` table auto-created with proper schema
5. ✅ All data now stored in XAMPP MySQL database

## ✨ Verification

You can verify data is in MySQL by:

1. **phpMyAdmin**: 
   - Open XAMPP Control Panel
   - Click "Admin" next to MySQL
   - Select `cura_ai` database
   - View `users` table

2. **Command Line**:
   ```bash
   mysql -h localhost -P 3307 -u root
   USE cura_ai;
   SELECT * FROM users;
   ```

3. **Python Script**:
   ```bash
   python -c "import pymysql; conn = pymysql.connect(host='localhost', port=3307, user='root', password='', database='cura_ai'); cursor = conn.cursor(); cursor.execute('SELECT COUNT(*) FROM users'); print(f'Total users: {cursor.fetchone()[0]}'); conn.close()"
   ```

---

**Your backend is now fully configured with MySQL! 🎉**

All user data will be stored in the `cura_ai` database in XAMPP's MySQL server on port 3307.
