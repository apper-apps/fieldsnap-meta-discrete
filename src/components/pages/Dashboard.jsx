import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import StatsCard from '@/components/molecules/StatsCard'
import ProjectCard from '@/components/molecules/ProjectCard'
import PhotoTile from '@/components/molecules/PhotoTile'
import { projectService } from '@/services/api/projectService'
import { photoService } from '@/services/api/photoService'

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [recentPhotos, setRecentPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [projectsData, photosData] = await Promise.all([
        projectService.getAll(),
        photoService.getAll()
      ])
      
      setProjects(projectsData)
      setRecentPhotos(photosData.slice(0, 6))
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadDashboardData()
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalPhotos = projects.reduce((sum, p) => sum + p.photoCount, 0)
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalTeamMembers = [...new Set(projects.flatMap(p => p.teamMembers))].length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary font-display">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 font-body">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <Link to="/capture">
          <Button variant="primary" size="lg" className="btn-hover">
            <ApperIcon name="Camera" size={20} className="mr-2" />
            Capture Photo
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          icon="FolderOpen"
          gradient="from-primary to-primary/80"
          trend={{ direction: 'up', value: '+12%' }}
        />
        <StatsCard
          title="Total Photos"
          value={totalPhotos}
          icon="Camera"
          gradient="from-accent to-accent/80"
          trend={{ direction: 'up', value: '+8%' }}
        />
        <StatsCard
          title="Completed Projects"
          value={completedProjects}
          icon="CheckCircle"
          gradient="from-success to-success/80"
        />
        <StatsCard
          title="Team Members"
          value={totalTeamMembers}
          icon="Users"
          gradient="from-info to-info/80"
        />
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary font-display">
            Recent Projects
          </h2>
          <Link to="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Empty
            type="projects"
            onAction={() => {/* Handle create project */}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.Id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Photos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary font-display">
            Recent Photos
          </h2>
          <Link to="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {recentPhotos.length === 0 ? (
          <Empty
            type="photos"
            onAction={() => {/* Handle capture photo */}}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentPhotos.map((photo) => (
              <PhotoTile key={photo.Id} photo={photo} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-secondary mb-4 font-display">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/capture">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <ApperIcon name="Camera" size={32} className="text-primary mb-2" />
              <h4 className="font-semibold text-secondary">Capture Photo</h4>
              <p className="text-sm text-gray-600">Take a new project photo</p>
            </motion.div>
          </Link>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
          >
            <ApperIcon name="FolderPlus" size={32} className="text-accent mb-2" />
            <h4 className="font-semibold text-secondary">New Project</h4>
            <p className="text-sm text-gray-600">Create a new project</p>
          </motion.div>
          
          <Link to="/reports">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-warning hover:bg-warning/5 transition-all duration-200 cursor-pointer"
            >
              <ApperIcon name="FileText" size={32} className="text-warning mb-2" />
              <h4 className="font-semibold text-secondary">Generate Report</h4>
              <p className="text-sm text-gray-600">Create project report</p>
            </motion.div>
          </Link>
          
          <Link to="/team">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-info hover:bg-info/5 transition-all duration-200 cursor-pointer"
            >
              <ApperIcon name="UserPlus" size={32} className="text-info mb-2" />
              <h4 className="font-semibold text-secondary">Invite Team</h4>
              <p className="text-sm text-gray-600">Add team members</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard