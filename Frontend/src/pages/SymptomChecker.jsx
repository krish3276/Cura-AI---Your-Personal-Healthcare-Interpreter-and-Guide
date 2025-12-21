import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SymptomChecker.css'

function SymptomChecker() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState('')
  const [detectedSymptoms, setDetectedSymptoms] = useState([])
  const [followUpQuestions, setFollowUpQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answers, setAnswers] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const symptomKeywords = [
    'headache', 'fever', 'cough', 'fatigue', 'nausea', 'pain', 'dizzy', 
    'sore throat', 'runny nose', 'congestion', 'shortness of breath',
    'chest pain', 'abdominal pain', 'vomiting', 'diarrhea', 'rash',
    'muscle aches', 'chills', 'sweating', 'weakness'
  ]

  const detectSymptoms = (text) => {
    const detected = []
    const lowerText = text.toLowerCase()
    
    symptomKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const formatted = keyword.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        if (!detected.includes(formatted)) {
          detected.push(formatted)
        }
      }
    })
    
    return detected
  }

  const handleSymptomsChange = (e) => {
    const text = e.target.value
    setSymptoms(text)
    
    if (text.length > 5) {
      const detected = detectSymptoms(text)
      setDetectedSymptoms(detected)
      
      // Generate follow-up questions
      if (detected.length > 0 && followUpQuestions.length === 0) {
        generateFollowUpQuestions(detected)
      }
    } else {
      setDetectedSymptoms([])
      setFollowUpQuestions([])
      setCurrentQuestion(null)
    }
  }

  const generateFollowUpQuestions = (symptoms) => {
    const questions = [
      {
        id: 1,
        question: 'On a scale of 1-10, how severe is the pain?',
        type: 'scale',
        options: Array.from({ length: 10 }, (_, i) => i + 1)
      },
      {
        id: 2,
        question: 'When did this start?',
        type: 'text',
        placeholder: 'e.g., 2 days ago'
      },
      {
        id: 3,
        question: 'Have you experienced this before?',
        type: 'choice',
        options: ['Yes', 'No', 'Not sure']
      },
      {
        id: 4,
        question: 'Are you taking any medications?',
        type: 'text',
        placeholder: 'e.g., Aspirin, none'
      }
    ]
    
    setFollowUpQuestions(questions)
    setCurrentQuestion(questions[0])
  }

  const handleAnswerQuestion = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Move to next question
    const currentIndex = followUpQuestions.findIndex(q => q.id === questionId)
    if (currentIndex < followUpQuestions.length - 1) {
      setCurrentQuestion(followUpQuestions[currentIndex + 1])
    } else {
      setCurrentQuestion(null)
    }
  }

  const handleAnalyze = async () => {
    if (!symptoms.trim() || symptoms.trim().length < 10) {
      alert('Please describe your symptoms in detail (at least 10 characters)')
      return
    }

    setIsAnalyzing(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/symptoms/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ symptoms, detectedSymptoms, answers })
      // })
      // const data = await response.json()

      // Simulated processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock comprehensive result
      const mockResult = {
        overallRisk: 'moderate', // low, moderate, high
        primaryCondition: 'Common Cold or Upper Respiratory Infection',
        confidence: 75,
        
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: 75,
            severity: 'low',
            description: 'A viral infection of the upper respiratory tract.',
            symptoms: ['Headache', 'Fever', 'Fatigue', 'Sore Throat'],
            typicalDuration: '7-10 days'
          },
          {
            name: 'Influenza (Flu)',
            probability: 60,
            severity: 'moderate',
            description: 'A contagious respiratory illness caused by influenza viruses.',
            symptoms: ['Fever', 'Fatigue', 'Muscle Aches', 'Headache'],
            typicalDuration: '1-2 weeks'
          },
          {
            name: 'Sinusitis',
            probability: 45,
            severity: 'low',
            description: 'Inflammation of the sinuses causing congestion and pain.',
            symptoms: ['Headache', 'Fatigue', 'Congestion'],
            typicalDuration: '2-4 weeks'
          }
        ],

        recommendations: [
          {
            priority: 'high',
            category: 'Immediate Care',
            action: 'Rest and Hydration',
            details: 'Get plenty of rest and drink fluids to help your body fight the infection. Aim for 8-10 glasses of water daily.'
          },
          {
            priority: 'medium',
            category: 'Symptom Relief',
            action: 'Over-the-Counter Medication',
            details: 'Consider taking acetaminophen or ibuprofen for fever and pain relief. Follow package directions.'
          },
          {
            priority: 'medium',
            category: 'Monitoring',
            action: 'Track Your Symptoms',
            details: 'Monitor your temperature and symptoms. Note any changes or worsening conditions.'
          },
          {
            priority: 'low',
            category: 'Prevention',
            action: 'Hygiene Practices',
            details: 'Wash hands frequently and avoid close contact with others to prevent spreading illness.'
          }
        ],

        whenToSeekCare: [
          'Fever above 103°F (39.4°C)',
          'Difficulty breathing or shortness of breath',
          'Persistent chest pain or pressure',
          'Severe or worsening headache',
          'Symptoms lasting more than 10 days',
          'Signs of dehydration (dark urine, dizziness)'
        ],

        selfCareAdvice: [
          'Stay home and get adequate rest',
          'Use a humidifier to ease breathing',
          'Gargle with warm salt water for sore throat',
          'Avoid smoking and alcohol',
          'Eat nutritious, easy-to-digest foods',
          'Keep room temperature comfortable'
        ],

        redFlags: [
          'Sudden severe headache unlike any before',
          'High fever with neck stiffness',
          'Confusion or difficulty staying awake',
          'Rapid heartbeat or breathing'
        ]
      }

      setResult(mockResult)
    } catch (err) {
      alert('Failed to analyze symptoms. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSymptoms('')
    setDetectedSymptoms([])
    setFollowUpQuestions([])
    setCurrentQuestion(null)
    setAnswers({})
    setResult(null)
  }

  const removeSymptom = (symptomToRemove) => {
    setDetectedSymptoms(prev => prev.filter(s => s !== symptomToRemove))
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'low': return '#10b981'
      case 'moderate': return '#f59e0b'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return '#10b981'
      case 'moderate': return '#f59e0b'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="symptom-checker-page">
      <Navbar />
      
      <div className="symptom-content">
        {!result ? (
          <div className="symptom-input-section">
            <div className="symptom-left">
              <div className="symptom-header">
                <h1 className="symptom-title">Hello! How are you feeling today?</h1>
                <p className="symptom-subtitle">Describe your symptoms below to get started.</p>
              </div>

              <div className="symptom-form">
                <label className="symptom-label">Describe your symptoms in detail</label>
                <textarea
                  className="symptom-textarea"
                  placeholder="e.g., I have a sharp headache and a slight fever..."
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  rows={6}
                />

                {detectedSymptoms.length > 0 && (
                  <div className="detected-symptoms">
                    <p className="detected-label">Detected Symptoms</p>
                    <div className="symptom-tags">
                      {detectedSymptoms.map((symptom, index) => (
                        <span key={index} className="symptom-tag">
                          {symptom}
                          <button 
                            className="remove-tag"
                            onClick={() => removeSymptom(symptom)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {followUpQuestions.map((q) => (
                  <div key={q.id} className="follow-up-question">
                    <div className="question-header">
                      <span className="ai-badge">AI Follow-up Question</span>
                      <p className="question-text">{q.question}</p>
                    </div>
                    
                    {answers[q.id] ? (
                      <div className="answer-display">
                        <span className="answer-value">{answers[q.id]}</span>
                      </div>
                    ) : currentQuestion?.id === q.id ? (
                      <div className="answer-input">
                        {q.type === 'scale' && (
                          <div className="scale-options">
                            {q.options.map(num => (
                              <button
                                key={num}
                                className="scale-btn"
                                onClick={() => handleAnswerQuestion(q.id, num.toString())}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {q.type === 'choice' && (
                          <div className="choice-options">
                            {q.options.map((option, idx) => (
                              <button
                                key={idx}
                                className="choice-btn"
                                onClick={() => handleAnswerQuestion(q.id, option)}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {q.type === 'text' && (
                          <div className="text-input-wrapper">
                            <input
                              type="text"
                              className="text-answer-input"
                              placeholder={q.placeholder}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  handleAnswerQuestion(q.id, e.target.value)
                                  e.target.value = ''
                                }
                              }}
                            />
                            <button 
                              className="submit-text-btn"
                              onClick={(e) => {
                                const input = e.target.previousSibling
                                if (input.value.trim()) {
                                  handleAnswerQuestion(q.id, input.value)
                                  input.value = ''
                                }
                              }}
                            >
                              →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}

                {!isAnalyzing ? (
                  <button 
                    className="btn-analyze" 
                    onClick={handleAnalyze}
                    disabled={!symptoms.trim() || symptoms.trim().length < 10}
                  >
                    Analyze My Symptoms
                  </button>
                ) : (
                  <div className="analyzing-indicator">
                    <div className="spinner"></div>
                    <p>Analyzing your symptoms...</p>
                  </div>
                )}
              </div>

              <div className="disclaimer-box">
                <p><strong>Disclaimer:</strong></p>
                <p>Cura AI is an informational tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
              </div>
            </div>

            <div className="symptom-right">
              <div className="illustration-card">
                <img 
                  src="https://illustrations.popsy.co/amber/doctor.svg" 
                  alt="Doctor Illustration"
                  className="doctor-illustration"
                />
                <div className="help-text">
                  <h3>Cura AI is ready to help</h3>
                  <p>As you describe your symptoms, I will provide real-time feedback and questions to better understand your condition. Once you're ready, click "Analyze" to see potential insights.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="result-section">
            <div className="result-header">
              <button className="btn-back" onClick={handleReset}>← Back to Symptom Input</button>
              <div className="risk-badge" style={{ backgroundColor: getRiskColor(result.overallRisk) }}>
                {result.overallRisk.toUpperCase()} RISK
              </div>
            </div>

            <div className="result-main">
              <h2 className="result-title">Symptom Analysis Results</h2>
              <div className="primary-diagnosis">
                <h3>{result.primaryCondition}</h3>
                <div className="confidence-bar">
                  <div className="confidence-label">
                    <span>Confidence Level</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="conditions-section">
                <h3>Possible Conditions</h3>
                <div className="conditions-grid">
                  {result.possibleConditions.map((condition, index) => (
                    <div key={index} className="condition-card">
                      <div className="condition-header">
                        <h4>{condition.name}</h4>
                        <span 
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(condition.severity) }}
                        >
                          {condition.severity}
                        </span>
                      </div>
                      <p className="condition-description">{condition.description}</p>
                      <div className="condition-meta">
                        <div className="meta-item">
                          <strong>Probability:</strong> {condition.probability}%
                        </div>
                        <div className="meta-item">
                          <strong>Typical Duration:</strong> {condition.typicalDuration}
                        </div>
                      </div>
                      <div className="matching-symptoms">
                        <strong>Matching Symptoms:</strong>
                        <div className="mini-tags">
                          {condition.symptoms.map((s, i) => (
                            <span key={i} className="mini-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recommendations-section">
                <h3>Recommended Actions</h3>
                <div className="recommendations-list">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                      <div className="rec-icon">
                        {rec.priority === 'high' ? '!' : rec.priority === 'medium' ? '•' : '·'}
                      </div>
                      <div className="rec-content">
                        <div className="rec-header-line">
                          <span className="rec-category">{rec.category}</span>
                          <h4>{rec.action}</h4>
                        </div>
                        <p>{rec.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="care-sections">
                <div className="care-card warning-card">
                  <h3>⚠️ When to Seek Immediate Medical Care</h3>
                  <ul>
                    {result.whenToSeekCare.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="care-card selfcare-card">
                  <h3>🏠 Self-Care Advice</h3>
                  <ul>
                    {result.selfCareAdvice.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="care-card redflag-card">
                  <h3>🚨 Red Flags - Seek Emergency Care If:</h3>
                  <ul>
                    {result.redFlags.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-save-results">Save to My Health Records</button>
                <button className="btn-find-doctor">Find a Doctor Near Me</button>
                <button className="btn-new-check" onClick={handleReset}>Check New Symptoms</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default SymptomChecker
