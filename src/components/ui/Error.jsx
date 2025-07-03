import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  type = 'generic' 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          actionText: 'Try Again'
        }
      case 'not-found':
        return {
          icon: 'Search',
          title: 'Not Found',
          message: 'The requested resource could not be found.',
          actionText: 'Go Back'
        }
      case 'photo-upload':
        return {
          icon: 'Camera',
          title: 'Upload Failed',
          message: 'Failed to upload photo. Please try again.',
          actionText: 'Retry Upload'
        }
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Error',
          message: message,
          actionText: 'Try Again'
        }
    }
  }

  const errorContent = getErrorContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
    >
      <div className="bg-error/10 rounded-full p-6 mb-6">
        <ApperIcon 
          name={errorContent.icon} 
          size={48} 
          className="text-error"
        />
      </div>
      
      <h2 className="text-2xl font-bold text-secondary mb-2 font-display">
        {errorContent.title}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md font-body">
        {errorContent.message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="btn-hover"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          {errorContent.actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Error