import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Features from './pages/Features'
import PrescriptionUpload from './pages/PrescriptionUpload'
import ReportAnalyzer from './pages/ReportAnalyzer'
import SymptomChecker from './pages/SymptomChecker'
import { authService } from './services/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated with valid token
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated()
      setIsAuthenticated(isAuth)
    }

    checkAuth()

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/prescription" element={<PrescriptionUpload />} />
        <Route path="/report-analyzer" element={<ReportAnalyzer />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/signup" element={<SignUp setAuth={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
      </Routes>
    </Router>
  )
}

export default App
