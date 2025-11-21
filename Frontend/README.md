# Cura AI - Frontend

Modern React frontend for Cura AI healthcare application.

## Features

- ✅ User Authentication (Signup/Login)
- ✅ Beautiful Landing Page
- ✅ Protected Routes
- ✅ API Integration with Backend
- ✅ Responsive Design
- ✅ Modern UI with Cyan Theme

## Tech Stack

- React 18
- Vite (Build Tool)
- React Router (Navigation)
- Axios (API Calls)
- CSS3 (Styling)

## Getting Started

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run on: **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── SignUp.jsx          # Signup page
│   │   ├── SignUp.css          # Signup styles
│   │   ├── Login.jsx           # Login page
│   │   └── Dashboard.jsx       # Landing/Dashboard page
│   │       └── Dashboard.css   # Dashboard styles
│   ├── services/
│   │   └── api.js              # API service & authentication
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## Pages

### 1. Signup Page (`/signup`)
- Full Name, Email, Password, Confirm Password
- Password visibility toggle
- Form validation
- Auto-login after signup
- Link to Login page

### 2. Login Page (`/login`)
- Email and Password fields
- Tab switcher (Sign In / Sign Up)
- Forgot Password link
- Google OAuth button (placeholder)
- Link to Signup page

### 3. Dashboard/Landing Page (`/`)
- Navigation bar with login/logout
- Hero section
- Features showcase
- Mission statement
- 4-step process
- User testimonials
- Call-to-action section
- Footer

## API Integration

The frontend connects to the backend API at `http://localhost:8000/api`

### Available Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/dashboard` - Get dashboard data

## Environment

Make sure your backend is running on `http://localhost:8000` before starting the frontend.

## Design

The design matches the provided mockups with:
- Cyan (#22d3ee) primary color
- Rounded cards and buttons
- Modern gradient backgrounds
- Clean, minimalist UI
- Responsive layout

## Development

To make changes:

1. Edit components in `src/pages/`
2. Modify styles in respective `.css` files
3. Update API calls in `src/services/api.js`
4. Changes auto-reload with Vite's HMR

## Troubleshooting

### CORS Errors
Make sure backend has CORS enabled for `http://localhost:3000`

### API Connection Failed
Ensure backend server is running on port 8000

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 3001  // Change to any available port
}
```

## License

© 2025 Cura AI. All rights reserved.
