import { motion } from 'framer-motion'
import './LoadingState.css'

/**
 * Accessible Loading State Component
 * Shows animated spinner with descriptive text
 */
function LoadingState({ message = "Processing...", subMessage = null }) {
  return (
    <motion.div
      className="loading-state"
      role="status"
      aria-live="polite"
      aria-label={message}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loading-spinner" aria-hidden="true">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      
      <h3 className="loading-message">{message}</h3>
      
      {subMessage && (
        <p className="loading-submessage">{subMessage}</p>
      )}
      
      <div className="loading-dots">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        >
          ●
        </motion.span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        >
          ●
        </motion.span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
        >
          ●
        </motion.span>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">Please wait while we process your request</span>
    </motion.div>
  )
}

export default LoadingState
