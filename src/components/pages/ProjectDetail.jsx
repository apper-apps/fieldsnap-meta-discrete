import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import PhotoTile from '@/components/molecules/PhotoTile'
import { projectService } from '@/services/api/projectService'
import { photoService } from '@/services/api/photoService'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [projectData, photosData] = await Promise.all([
        projectService.getById(parseInt(projectId)),
        photoService.getAll()
      ])
      
      setProject(projectData)
      // Filter photos by project ID
      const projectPhotos = photosData.filter(photo => photo.projectId === parseInt(projectId))
      setPhotos(projectPhotos)
    } catch (err) {
      setError('Failed to load project data')
      console.error('Project detail error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadProjectData()
  }

  if (loading) {
    return <Loading type="project-detail" />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  if (!project) {
    return <Error message="Project not found" type="not-found" />
  }

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

  const filteredPhotos = photos.filter(photo => {
    if (filter === 'all') return true
    if (filter === 'recent') return new Date(photo.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (filter === 'annotated') return photo.annotations && photo.annotations.length > 0
    return true
  })

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Project Header */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2 font-display">
              {project.name}
            </h1>
            <p className="text-xl text-gray-600 font-body">
              {project.clientName}
            </p>
          </div>
          <Badge
            variant={getStatusVariant(project.status)}
            icon={getStatusIcon(project.status)}
            size="lg"
          >
            {project.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <ApperIcon name="MapPin" size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-secondary">{project.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ApperIcon name="Calendar" size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-secondary">
                {format(new Date(project.startDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ApperIcon name="Camera" size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Photos</p>
              <p className="font-medium text-secondary">{photos.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ApperIcon name="Users" size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Team Members</p>
              <p className="font-medium text-secondary">{project.teamMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/capture">
            <Button variant="primary" className="btn-hover">
              <ApperIcon name="Camera" size={20} className="mr-2" />
              Capture Photo
            </Button>
          </Link>
          <Button variant="outline">
            <ApperIcon name="FileText" size={20} className="mr-2" />
            Generate Report
          </Button>
          <Button variant="ghost">
            <ApperIcon name="Share" size={20} className="mr-2" />
            Share Project
          </Button>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary font-display">
            Project Photos
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'recent'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setFilter('annotated')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'annotated'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Annotated
              </button>
            </div>
            
            <Button variant="ghost">
              <ApperIcon name="Grid" size={20} className="mr-2" />
              View Options
            </Button>
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <Empty
            type="photos"
            message="No photos found for this project yet."
            actionText="Take First Photo"
            onAction={() => {/* Handle capture photo */}}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {filteredPhotos.map((photo) => (
              <PhotoTile key={photo.Id} photo={photo} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-secondary mb-4 font-display">
          Team Members
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          {project.teamMembers.map((memberId) => (
            <div key={memberId} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-secondary">
                Team Member {memberId}
              </span>
            </div>
          ))}
          <Button variant="ghost" size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Member
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail