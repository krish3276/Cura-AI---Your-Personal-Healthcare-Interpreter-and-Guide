import { motion } from 'framer-motion'
import './ResultCard.css'

/**
 * Reusable Result Card Component
 * Displays information in an accessible, animated card format
 */
function ResultCard({ 
  title, 
  children, 
  icon = null,
  variant = 'default', // default, success, warning, info
  delay = 0
}) {
  const variants = {
    default: 'card-default',
    success: 'card-success',
    warning: 'card-warning',
    info: 'card-info',
    danger: 'card-danger'
  }

  return (
    <motion.div
      className={`result-card ${variants[variant]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      role="region"
      aria-label={title}
    >
      {(title || icon) && (
        <div className="card-header">
          {icon && (
            <div className="card-icon" aria-hidden="true">
              {icon}
            </div>
          )}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
    </motion.div>
  )
}

export default ResultCard
