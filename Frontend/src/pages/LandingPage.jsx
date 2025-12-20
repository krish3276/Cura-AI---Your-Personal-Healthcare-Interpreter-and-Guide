import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">💊</span>
            <span className="logo-text">Cura AI</span>
          </div>
          <nav className="nav-links">
            <a href="#dashboard">Dashboard</a>
            <a href="#features">Features</a>
            <a href="#profile">Profile</a>
          </nav>
          <Link to="/signup" className="btn-get-started">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Intelligent Healthcare,<br />Simplified.
            </h1>
            <p className="hero-subtitle">
              Explore the powerful features that make Cura AI your essential healthcare companion.
            </p>
            <Link to="/signup" className="btn-hero">Get Started</Link>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop" 
              alt="Healthcare Professional"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-content">
          <h2 className="features-title">Our Core Features</h2>
          <p className="features-subtitle">
            Everything you need for smarter health management.
          </p>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f7f7' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#00d9e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#00d9e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">OCR Prescription Reader</h3>
              <p className="feature-description">
                Instantly digitize prescriptions into text for easy management and sharing.
              </p>
              <a href="#" className="feature-link">Learn More →</a>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f7f7' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00d9e1" strokeWidth="2"/>
                  <path d="M3 9h18M9 21V9" stroke="#00d9e1" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Medical Report Analyzer</h3>
              <p className="feature-description">
                Simplify complex medical reports and lab results into understandable insights.
              </p>
              <a href="#" className="feature-link">Learn More →</a>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f7f7' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="#00d9e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#00d9e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">AI Symptom Checker</h3>
              <p className="feature-description">
                Follow an intelligent, guided process to check symptoms and understand potential causes.
              </p>
              <a href="#" className="feature-link">Learn More →</a>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f7f7' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="#00d9e1" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="#00d9e1" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Text-to-Speech</h3>
              <p className="feature-description">
                Listen to your medical information read aloud for improved accessibility.
              </p>
              <a href="#" className="feature-link">Learn More →</a>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f7f7' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#00d9e1" strokeWidth="2"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="#00d9e1" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Multilingual Support</h3>
              <p className="feature-description">
                Communicate and receive health information in a variety of languages.
              </p>
              <a href="#" className="feature-link">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#about">About Us</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00d9e1">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00d9e1">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00d9e1">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
        <p className="footer-copyright">© 2024 Cura AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
