import { motion } from 'framer-motion'
import './EmptyState.css'

/**
 * Accessible Empty State Component
 * Shows when there's no data or user needs to take action
 */
function EmptyState({ 
  icon = null,
  title = "No data yet",
  message = "Get started by taking an action",
  actionText = null,
  onAction = null,
  suggestions = []
}) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      
      {suggestions.length > 0 && (
        <div className="empty-suggestions">
          <p className="suggestions-title">Try these:</p>
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
      
      {actionText && onAction && (
        <motion.button
          className="btn-action"
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={actionText}
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState
