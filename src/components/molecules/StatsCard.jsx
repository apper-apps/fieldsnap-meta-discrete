import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  gradient = 'from-primary to-primary/80' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium font-body mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-secondary font-display">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.direction === 'up' ? 'text-success' : 'text-error'
            }`}>
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="mr-1" 
              />
              {trend.value}
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl`}>
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard