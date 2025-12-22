import { motion } from 'framer-motion'
import './ErrorState.css'

/**
 * Accessible Error State Component
 * Shows friendly error message with retry option
 */
function ErrorState({ 
  message = "Something went wrong", 
  details = null,
  onRetry = null,
  retryText = "Try Again"
}) {
  return (
    <motion.div
      className="error-state"
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="error-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>

      <h3 className="error-title">{message}</h3>
      
      {details && (
        <p className="error-details">{details}</p>
      )}

      <div className="error-suggestions">
        <p>Here's what you can try:</p>
        <ul>
          <li>Check your internet connection</li>
          <li>Refresh the page</li>
          <li>Try again in a few moments</li>
          {!onRetry && <li>Contact support if the problem persists</li>}
        </ul>
      </div>

      {onRetry && (
        <motion.button
          className="btn-retry"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Retry the operation"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {retryText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default ErrorState
