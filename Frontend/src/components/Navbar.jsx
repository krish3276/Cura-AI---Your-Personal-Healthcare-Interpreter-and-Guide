import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">💊</span>
          <span className="logo-text">Cura AI</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/prescription" className="nav-link">Prescriptions</Link>
          <Link to="/report-analyzer" className="nav-link">Report Analyzer</Link>
          <Link to="/symptom-checker" className="nav-link">Symptom Checker</Link>
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/signup" className="btn-signup">Get Started</Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mobile-menu"
        >
          <Link to="/" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link to="/features" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/prescription" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Prescriptions</Link>
          <Link to="/report-analyzer" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Report Analyzer</Link>
          <Link to="/symptom-checker" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Symptom Checker</Link>
          <Link to="/login" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
          <Link to="/signup" className="mobile-menu-link mobile-menu-signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
