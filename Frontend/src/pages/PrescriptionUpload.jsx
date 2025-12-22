import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PrescriptionUpload.css'

function PrescriptionUpload() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileSelect = (file) => {
    setError('')
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or PDF file')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should not exceed 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Get auth token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Please login first')
        navigate('/login')
        return
      }

      // Call actual backend API
      const response = await fetch('http://localhost:8000/api/prescription/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()
      
      // Parse medicines JSON string to array
      let medications = []
      try {
        medications = JSON.parse(data.data.medicines || '[]')
      } catch (e) {
        console.error('Failed to parse medicines:', e)
        medications = []
      }

      // Transform API response to match UI structure
      const transformedResult = {
        medications: medications.map(med => ({
          name: med.medicine_name || 'Unknown',
          dosage: med.dosage || 'Not detected',
          frequency: med.instructions || 'See prescription',
          duration: '',
          confidence: med.confidence || 'low'
        })),
        extractedText: data.data.extracted_text || '',
        explanation: data.data.simplified_explanation || '',
        instructions: data.data.simplified_explanation || '',
        processingStatus: data.data.processing_status,
        filename: data.data.original_filename,
        date: new Date(data.data.created_at).toLocaleDateString()
      }

      setResult(transformedResult)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to process prescription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="prescription-upload-page">
      <Navbar />
      
      <div className="prescription-content">
        <div className="prescription-header">
          <h1 className="prescription-title">Upload Your Prescription</h1>
          <p className="prescription-subtitle">Let Cura AI digitize your prescription details for you.</p>
        </div>

        {!result ? (
          <>
            <div className="upload-container">
              <div 
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                {previewUrl && (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}

                {selectedFile && (
                  <div className="file-info">
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}

                <div className="upload-text">
                  <p className="upload-main-text">Drag & drop your file here or</p>
                </div>

                <label htmlFor="file-input" className="choose-file-btn">
                  Choose File
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <p className="upload-hint">Supports: JPG, PNG, PDF. Max size: 10MB.</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              {selectedFile && !isProcessing && (
                <div className="upload-actions">
                  <button className="btn-process" onClick={handleUpload}>
                    Process Prescription
                  </button>
                  <button className="btn-reset" onClick={handleReset}>
                    Clear
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <p>Processing your prescription...</p>
                </div>
              )}
            </div>

            <div className="tips-section">
              <h2 className="tips-title">Tips for a Clear Scan</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="tip-title">Flat Surface</h3>
                  <p className="tip-description">Place on a flat, dark surface.</p>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="tip-title">Bright Lighting</h3>
                  <p className="tip-description">Ensure bright, even lighting.</p>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <h3 className="tip-title">Capture All</h3>
                  <p className="tip-description">Capture the entire document.</p>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="tip-title">Clear Text</h3>
                  <p className="tip-description">Check for clear, readable text.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="result-container">
            <div className="result-header">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2>Prescription Processed Successfully!</h2>
            </div>

            <div className="result-content">
              <div className="result-section">
                <h3>Medications</h3>
                {result.medications.map((med, index) => (
                  <div key={index} className="medication-card">
                    <div className="med-header">
                      <h4>{med.name}</h4>
                      <span className="med-dosage">{med.dosage}</span>
                    </div>
                    <p className="med-frequency">{med.frequency}</p>
                    <p className="med-duration">Duration: {med.duration}</p>
                  </div>
                ))}
              </div>

              <div className="result-section">
                <h3>Instructions</h3>
                <p className="instructions-text">{result.instructions}</p>
              </div>

              <div className="result-meta">
                <p><strong>Prescribed by:</strong> {result.doctor}</p>
                <p><strong>Date:</strong> {result.date}</p>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn-save">Save to My Prescriptions</button>
              <button className="btn-new" onClick={handleReset}>Upload Another</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default PrescriptionUpload
