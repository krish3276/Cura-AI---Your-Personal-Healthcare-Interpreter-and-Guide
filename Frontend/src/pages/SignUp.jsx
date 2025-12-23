import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SignUp.css'

function SignUp({ setAuth }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setSuccess('')

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    // Username validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    // Password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter')
      return
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter')
      return
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      console.log('Submitting signup to:', 'http://localhost:8000/api/auth/signup')
      console.log('Signup data:', { username: formData.username, email: formData.email })
      
      const result = await authService.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      console.log('Signup successful:', result)
      
      // Show success message
      setSuccess('Account created successfully! Redirecting to login...')
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created! Please login.' } })
      }, 2000)
      
    } catch (err) {
      console.error('Signup error:', err)
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error
        let errorMsg = 'Signup failed. Please try again.'
        
        // Handle FastAPI validation errors (422)
        if (err.response.status === 422 && Array.isArray(err.response?.data?.detail)) {
          // Extract validation error messages
          const validationErrors = err.response.data.detail
            .map(err => err.msg || err.message)
            .join(', ')
          errorMsg = `Validation error: ${validationErrors}`
        } 
        // Handle string error messages
        else if (typeof err.response?.data?.detail === 'string') {
          errorMsg = err.response.data.detail
        }
        // Handle object error messages with a message property
        else if (err.response?.data?.detail?.message) {
          errorMsg = err.response.data.detail.message
        }
        
        console.error('Server error:', err.response.status, errorMsg)
        setError(errorMsg)
      } else if (err.request) {
        // Request made but no response (network error)
        console.error('Network error - no response from server')
        setError('Cannot connect to server. Please check if backend is running on http://localhost:8000')
      } else {
        // Something else happened
        console.error('Unexpected error:', err.message)
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="app-title">Cura AI</h1>
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">
            Get started with Cura AI, your smart healthcare assistant
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your full name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="8+ characters with uppercase, lowercase & number"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* {showPassword ? '👁️' : '🙈'}x */}
              </button>
            </div>
            <small style={{ color: '#666', fontSize: '0.85em', marginTop: '4px', display: 'block' }}>
              Must include uppercase, lowercase, and a number
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {/* {showConfirmPassword ? '👁️' : '🙈'} */}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
    <Footer />
  </>
  )
}

export default SignUp
