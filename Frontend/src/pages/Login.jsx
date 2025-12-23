import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SignUp.css'

function Login({ setAuth }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('signin')
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.username || !formData.password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)

    try {
      console.log('Attempting login to:', 'http://localhost:8000/api/auth/login')
      console.log('Login credentials:', { username: formData.username })
      
      const result = await authService.login({
        username: formData.username,
        password: formData.password
      })
      
      console.log('Login successful:', result)
      
      setAuth(true)
      // Redirect to symptom checker (main feature page)
      navigate('/symptom-checker')
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.response) {
        const errorMsg = err.response?.data?.detail || 'Invalid credentials. Please try again.'
        console.error('Server error:', err.response.status, errorMsg)
        setError(errorMsg)
      } else if (err.request) {
        console.error('Network error - no response from server')
        setError('Cannot connect to server. Please check if backend is running on http://localhost:8000')
      } else {
        console.error('Unexpected error:', err.message)
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Google OAuth integration would go here
    alert('Google login will be implemented soon!')
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="app-title">Cura AI</h1>
          <p className="auth-subtitle" style={{ marginBottom: '20px' }}>
            Your Smart Healthcare Assistant
          </p>
          
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>

          <h2 className="auth-title">Welcome back</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your email address"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
    <Footer />
  </>
  )
}

export default Login
