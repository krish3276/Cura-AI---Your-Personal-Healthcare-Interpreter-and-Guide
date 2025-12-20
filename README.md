# 💊 Cura AI - Your Personal Healthcare Interpreter and Guide

A modern, intelligent healthcare application that provides personalized health management through symptom analysis, appointment scheduling, medication reminders, and health insights.

## 🌟 Features

### 🎯 Core Functionality
- **Instant Symptom Analysis** - Get intelligent feedback on your symptoms anytime, anywhere
- **Appointment Scheduling** - Easily schedule, track, and receive reminders for medical appointments
- **Medication Reminders** - Receive tailored advice and medication reminders based on your health profile
- **User Authentication** - Secure signup/login with JWT-based authentication
- **Modern Landing Page** - Beautiful, responsive landing page with smooth animations

### 🎨 Design
- Clean, minimal, professional healthcare UI
- Fully responsive design for all devices
- Mobile-friendly with hamburger menu navigation
- Smooth animations using Framer Motion
- Cyan-themed modern interface

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **Vite 5.4.10** - Fast build tool and dev server
- **React Router DOM 6.22.0** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Axios 1.6.7** - HTTP client for API calls
- **CSS3** - Custom styling (migrated from Tailwind CSS)

### Backend
- **FastAPI** - Modern Python web framework
- **MySQL 8.0+** - Database
- **SQLAlchemy** - ORM for database operations
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

## 📁 Project Structure

```
Cura-AI/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LandingPage.css
│   │   │   ├── SignUp.jsx
│   │   │   ├── SignUp.css
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── Backend/
│   ├── auth/
│   │   ├── routes.py
│   │   ├── jwt_handler.py
│   │   └── hashing.py
│   ├── utils/
│   │   ├── dependencies.py
│   │   └── responses.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   ├── requirements.txt
│   ├── database_setup.sql
│   └── README.md
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.9+**
- **MySQL 8.0+**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Cura-AI---Your-Personal-Healthcare-Interpreter-and-Guide
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd Backend
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

#### Setup MySQL Database
```sql
CREATE DATABASE cura_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Configure Environment
Create a `.env` file in the Backend directory or update `config.py`:
```python
DATABASE_URL = "mysql+pymysql://root:your_password@localhost/cura_ai"
SECRET_KEY = "your-secret-key-here"
```

#### Run Database Setup
```bash
python database.py
```

#### Start Backend Server
```bash
cd Backend
uvicorn main:app --reload
```

Backend runs on: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### 3. Frontend Setup

#### Install Dependencies
```bash
cd Frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

Frontend runs on: **http://localhost:5173** (or next available port)

## 📱 Application Pages

### 🏠 Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- Mission statement
- User testimonials
- Call-to-action section
- Footer with social links
- Sticky navbar with scroll effects
- Mobile-responsive hamburger menu

### 📝 Sign Up (`/signup`)
- User registration form
- Password validation
- Email validation
- Redirect to login after successful signup

### 🔐 Login (`/login`)
- User authentication
- JWT token-based session
- Redirect to dashboard after login

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (protected)

### Users
- `GET /users/` - List all users (protected)

## 🎨 Design System

### Color Palette
- **Primary**: #22d3ee (Cyan)
- **Primary Hover**: #06b6d4 (Darker Cyan)
- **Text Dark**: #111827
- **Text Gray**: #4b5563
- **Text Light**: #9ca3af
- **Background**: #f9fafb
- **White**: #ffffff

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
- **Headings**: Bold, large sizes (2rem - 3.5rem)
- **Body**: Regular, 1rem
- **Buttons**: Semi-bold, 0.875rem - 1rem

## 📦 Key Dependencies

### Frontend
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0",
  "framer-motion": "^11.0.3",
  "axios": "^1.6.7",
  "vite": "^5.4.10"
}
```

### Backend
```
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pymysql==1.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.3
cryptography==42.0.0
```

## 🔧 Development Commands

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload

# Run with custom port
uvicorn main:app --reload --port 8080
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- CORS enabled
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)

## 🎯 Future Enhancements

- [ ] AI-powered symptom checker
- [ ] Telemedicine integration
- [ ] Health records management
- [ ] Prescription tracking
- [ ] Fitness tracker integration
- [ ] Nutrition recommendations
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed with ❤️ by the Cura AI Team

## 📞 Support

For support, email support@curaai.com or join our community forum.

## 🙏 Acknowledgments

- Icons from Heroicons
- Animations powered by Framer Motion
- UI inspiration from modern healthcare applications

---

**Made with 💊 for better healthcare access**
