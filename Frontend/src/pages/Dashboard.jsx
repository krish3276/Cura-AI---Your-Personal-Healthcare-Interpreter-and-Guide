import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">Cura AI</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#mission">Mission</a>
            <a href="#pricing">Pricing</a>
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout} className="nav-link-btn">Logout</button>
                <span className="user-name">Hi, {user?.username}</span>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="nav-link-btn">Login</button>
                <button onClick={() => navigate('/signup')} className="btn-signup">Sign Up for Free</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Personalized Healthcare at Your Fingertips
            </h1>
            <p className="hero-description">
              Cura AI is your smart assistant, making healthcare more accessible and intelligent. Get instant symptom analysis, manage appointments, and receive personalized health insights.
            </p>
            <button className="btn-get-started" onClick={() => navigate('/signup')}>
              Get Started Now
            </button>
          </div>
          <div className="hero-image">
            <div className="gradient-circle"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">How Cura AI Can Help You</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#e0f2fe' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h3>Instant Symptom Analysis</h3>
            <p>Just answer a few questions about your symptoms and let us analyze what could be causing them.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#ddd6fe' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
            </div>
            <h3>Report Analyzer</h3>
            <p>Easily upload, view, and get reminders for all your medical appointments.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#ccfbf1' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                <path d="M9 12h6m-6 4h6"/>
              </svg>
            </div>
            <h3>Prescription Reader</h3>
            <p>Scan prescriptions and find health products within your budget.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="mission-section">
        <div className="mission-content">
          <div className="mission-image">
            <div className="gradient-circle-dark"></div>
          </div>
          <div className="mission-text">
            <h2 className="section-title-left">Our Mission: Healthcare, Reimagined</h2>
            <p className="mission-description">
              We believe in a future where everyone has access to intelligent, personalized, and compassionate healthcare. Cura AI is a step towards making that future a reality by putting a smart health assistant in your pocket.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <h2 className="section-title">Your Path to clarity in 4 Simple Steps</h2>
        <p className="steps-subtitle">Understand your health reports with Cura AI's intelligent analysis</p>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon" style={{ background: '#ccfbf1' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3>Securely Upload Your Report</h3>
            <p>Upload your medical document, such as a PDF or image file. Your data is encrypted and secure.</p>
          </div>

          <div className="step-card">
            <div className="step-icon" style={{ background: '#e0f2fe' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3>AI Analyzes Your Data</h3>
            <p>Our advanced AI technology processes the information from your report to identify key findings.</p>
          </div>

          <div className="step-card">
            <div className="step-icon" style={{ background: '#dbeafe' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
            </div>
            <h3>Receive a Simplified Summary</h3>
            <p>Translation of key findings, complex medical terms, and organized information.</p>
          </div>

          <div className="step-card">
            <div className="step-icon" style={{ background: '#fef3c7' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16h6"/>
                <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <h3>Ask Questions & Get Answers</h3>
            <p>Have specific questions about your summary? Ask away!</p>
          </div>
        </div>

        <button className="btn-begin-analysis">Begin Your Analysis</button>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Trusted by Users Like You</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Using AI has been a game changer for managing my family's health. The symptom checker helped me understand when to seek medical attention."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div>
                <div className="author-name">John D.</div>
                <div className="author-role">Parent of three</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-text">
              "As someone with a chronic condition, the medication reminders and AI's Mission. If any of the medication reminded me on time."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SK</div>
              <div>
                <div className="author-name">Sarah K.</div>
                <div className="author-role">Chronic condition patient</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-text">
              "I've used many health apps, but this one stands out. It's like I have a knowledgeable friend who is here for me 24/7, always efficient, and respectful."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MB</div>
              <div>
                <div className="author-name">Michael B.</div>
                <div className="author-role">Health enthusiast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Take Control of Your Health Today</h2>
          <p className="cta-description">
            Join thousands of users who are making their health a priority with Cura AI. Sign up for free and get started in minutes.
          </p>
          <button className="btn-cta" onClick={() => navigate('/signup')}>
            Sign Up for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span>🏥</span> 
            <span>© 2025 Cura AI. All rights reserved.</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
