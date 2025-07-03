import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  type = 'generic',
  onAction = null,
  message = null,
  actionText = null
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'projects':
        return {
          icon: 'FolderPlus',
          title: 'No Projects Yet',
          message: message || 'Get started by creating your first project to organize and track your fieldwork.',
          actionText: actionText || 'Create Project',
          gradient: 'from-primary to-accent'
        }
      case 'photos':
        return {
          icon: 'Camera',
          title: 'No Photos Yet',
          message: message || 'Start documenting your work by capturing photos for this project.',
          actionText: actionText || 'Take Photo',
          gradient: 'from-accent to-primary'
        }
      case 'team':
        return {
          icon: 'Users',
          title: 'No Team Members',
          message: message || 'Invite team members to collaborate on your projects.',
          actionText: actionText || 'Invite Member',
          gradient: 'from-info to-accent'
        }
      case 'reports':
        return {
          icon: 'FileText',
          title: 'No Reports Generated',
          message: message || 'Create professional reports from your project photos and data.',
          actionText: actionText || 'Generate Report',
          gradient: 'from-warning to-primary'
        }
      default:
        return {
          icon: 'Inbox',
          title: 'No Data Available',
          message: message || 'There is no data to display at the moment.',
          actionText: actionText || 'Refresh',
          gradient: 'from-gray-400 to-gray-600'
        }
    }
  }

  const emptyContent = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
    >
      <div className={`bg-gradient-to-br ${emptyContent.gradient} rounded-full p-8 mb-6 shadow-lg`}>
        <ApperIcon 
          name={emptyContent.icon} 
          size={64} 
          className="text-white"
        />
      </div>
      
      <h2 className="text-3xl font-bold text-secondary mb-3 font-display">
        {emptyContent.title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md font-body text-lg">
        {emptyContent.message}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          className="btn-hover shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {emptyContent.actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty