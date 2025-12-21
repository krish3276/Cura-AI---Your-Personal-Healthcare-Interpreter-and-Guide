import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ReportAnalyzer.css'

function ReportAnalyzer() {
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

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/report/analyze', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      // Simulated processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Enhanced mock result with comprehensive analysis
      const mockResult = {
        reportType: 'Complete Blood Count (CBC)',
        date: new Date().toLocaleDateString(),
        summary: 'Your blood test results show mostly normal values with a few parameters requiring attention.',
        overallStatus: 'attention', // can be: normal, attention, critical
        
        keyFindings: [
          { 
            name: 'Hemoglobin', 
            value: '11.2 g/dL', 
            normalRange: '12.0-16.0 g/dL',
            status: 'low',
            description: 'Your hemoglobin is slightly below normal range, which may indicate mild anemia.'
          },
          { 
            name: 'White Blood Cells', 
            value: '7,500 cells/μL', 
            normalRange: '4,000-11,000 cells/μL',
            status: 'normal',
            description: 'WBC count is within normal range, indicating healthy immune function.'
          },
          { 
            name: 'Platelets', 
            value: '225,000 cells/μL', 
            normalRange: '150,000-450,000 cells/μL',
            status: 'normal',
            description: 'Platelet count is normal, showing good blood clotting ability.'
          },
          { 
            name: 'Blood Glucose', 
            value: '115 mg/dL', 
            normalRange: '70-100 mg/dL',
            status: 'attention',
            description: 'Slightly elevated fasting glucose. May indicate prediabetes - lifestyle modifications recommended.'
          }
        ],

        detailedAnalysis: {
          categories: [
            {
              name: 'Blood Cells',
              metrics: [
                { parameter: 'RBC Count', value: '4.2 million/μL', status: 'normal' },
                { parameter: 'Hematocrit', value: '38%', status: 'low' },
                { parameter: 'MCV', value: '88 fL', status: 'normal' },
                { parameter: 'MCH', value: '30 pg', status: 'normal' }
              ]
            },
            {
              name: 'Liver Function',
              metrics: [
                { parameter: 'ALT', value: '28 U/L', status: 'normal' },
                { parameter: 'AST', value: '32 U/L', status: 'normal' },
                { parameter: 'Bilirubin', value: '0.8 mg/dL', status: 'normal' }
              ]
            },
            {
              name: 'Kidney Function',
              metrics: [
                { parameter: 'Creatinine', value: '0.9 mg/dL', status: 'normal' },
                { parameter: 'BUN', value: '18 mg/dL', status: 'normal' },
                { parameter: 'eGFR', value: '95 mL/min', status: 'normal' }
              ]
            }
          ]
        },

        recommendations: [
          {
            priority: 'high',
            title: 'Increase Iron Intake',
            description: 'Include iron-rich foods like spinach, red meat, and fortified cereals to address low hemoglobin levels.'
          },
          {
            priority: 'medium',
            title: 'Monitor Blood Glucose',
            description: 'Check fasting glucose regularly and consider reducing sugar intake. Consult with a nutritionist.'
          },
          {
            priority: 'low',
            title: 'Stay Hydrated',
            description: 'Maintain adequate hydration for optimal blood volume and organ function.'
          },
          {
            priority: 'medium',
            title: 'Follow-up Test',
            description: 'Recheck CBC in 6-8 weeks to monitor hemoglobin levels after dietary changes.'
          }
        ],

        insights: [
          'Your immune system appears healthy based on normal WBC count',
          'Kidney and liver function tests are all within normal ranges',
          'Consider vitamin B12 and folate supplementation if hemoglobin doesn\'t improve',
          'Regular exercise can help improve glucose metabolism'
        ],

        nextSteps: [
          'Schedule a follow-up with your primary care physician',
          'Start tracking your iron and sugar intake',
          'Retest in 6-8 weeks to monitor progress',
          'Consider consulting a hematologist if anemia persists'
        ]
      }

      setResult(mockResult)
    } catch (err) {
      setError('Failed to analyze report. Please try again.')
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return '#10b981'
      case 'low': 
      case 'attention': return '#f59e0b'
      case 'high':
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'normal': return '✓'
      case 'low': return '↓'
      case 'high': return '↑'
      case 'attention': return '⚠'
      case 'critical': return '⚠'
      default: return '•'
    }
  }

  return (
    <div className="report-analyzer-page">
      <Navbar />
      
      <div className="report-content">
        <div className="report-header">
          <h1 className="report-title">Medical Report Analyzer</h1>
          <p className="report-subtitle">Upload your lab reports and get instant AI-powered insights</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  <button className="btn-analyze" onClick={handleAnalyze}>
                    Analyze Report
                  </button>
                  <button className="btn-reset" onClick={handleReset}>
                    Clear
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <p>Analyzing your medical report...</p>
                  <p className="processing-sub">This may take a few moments</p>
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
              <div className={`status-badge ${result.overallStatus}`}>
                <span className="status-icon">{getStatusIcon(result.overallStatus)}</span>
                <span>{result.overallStatus === 'normal' ? 'All Clear' : result.overallStatus === 'attention' ? 'Needs Attention' : 'Critical'}</span>
              </div>
              <h2>{result.reportType}</h2>
              <p className="report-date">Report Date: {result.date}</p>
            </div>

            <div className="summary-card">
              <h3>Executive Summary</h3>
              <p>{result.summary}</p>
            </div>

            <div className="findings-section">
              <h3>Key Findings</h3>
              <div className="findings-grid">
                {result.keyFindings.map((finding, index) => (
                  <div key={index} className="finding-card" style={{ borderLeftColor: getStatusColor(finding.status) }}>
                    <div className="finding-header">
                      <h4>{finding.name}</h4>
                      <span className="status-indicator" style={{ backgroundColor: getStatusColor(finding.status) }}>
                        {getStatusIcon(finding.status)}
                      </span>
                    </div>
                    <div className="finding-value">
                      <span className="value">{finding.value}</span>
                      <span className="normal-range">Normal: {finding.normalRange}</span>
                    </div>
                    <p className="finding-description">{finding.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="detailed-analysis">
              <h3>Detailed Analysis</h3>
              {result.detailedAnalysis.categories.map((category, index) => (
                <div key={index} className="analysis-category">
                  <h4 className="category-name">{category.name}</h4>
                  <div className="metrics-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.metrics.map((metric, idx) => (
                          <tr key={idx}>
                            <td>{metric.parameter}</td>
                            <td className="metric-value">{metric.value}</td>
                            <td>
                              <span className={`status-badge-small ${metric.status}`}>
                                {getStatusIcon(metric.status)} {metric.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="recommendations-section">
              <h3>Recommendations</h3>
              <div className="recommendations-list">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                    <div className="rec-header">
                      <span className={`priority-badge ${rec.priority}`}>
                        {rec.priority === 'high' ? '!' : rec.priority === 'medium' ? '•' : '·'}
                      </span>
                      <h4>{rec.title}</h4>
                    </div>
                    <p>{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="insights-section">
              <h3>AI Insights</h3>
              <ul className="insights-list">
                {result.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>

            <div className="next-steps-section">
              <h3>Next Steps</h3>
              <ol className="next-steps-list">
                {result.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="result-actions">
              <button className="btn-save">Save to My Reports</button>
              <button className="btn-download">Download PDF</button>
              <button className="btn-new" onClick={handleReset}>Analyze Another</button>
            </div>

            <div className="disclaimer">
              <p><strong>⚠️ Medical Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Always consult with your healthcare provider for medical decisions.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ReportAnalyzer
