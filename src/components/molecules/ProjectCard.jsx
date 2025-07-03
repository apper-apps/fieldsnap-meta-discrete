import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ProjectCard = ({ project }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success'
      case 'completed':
        return 'accent'
      case 'on-hold':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Play'
      case 'completed':
        return 'CheckCircle'
      case 'on-hold':
        return 'Pause'
      case 'cancelled':
        return 'XCircle'
      default:
        return 'Circle'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card-hover"
    >
      <Link to={`/projects/${project.Id}`}>
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-2 font-display">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm font-body">
                {project.clientName}
              </p>
            </div>
            <Badge
              variant={getStatusVariant(project.status)}
              icon={getStatusIcon(project.status)}
            >
              {project.status}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <ApperIcon name="MapPin" size={16} className="mr-2" />
              {project.address}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              Started {format(new Date(project.startDate), 'MMM dd, yyyy')}
            </div>
          </div>

          {/* Photo preview grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center"
              >
                <ApperIcon name="Camera" size={20} className="text-gray-400" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 text-sm">
              <ApperIcon name="Camera" size={16} className="mr-2" />
              {project.photoCount} photos
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <ApperIcon name="Users" size={16} className="mr-2" />
              {project.teamMembers.length} members
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProjectCard