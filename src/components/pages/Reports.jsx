import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { projectService } from '@/services/api/projectService'
import { photoService } from '@/services/api/photoService'

const Reports = () => {
  const [projects, setProjects] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [reportType, setReportType] = useState('summary')
  const [dateRange, setDateRange] = useState('all')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [projectsData, photosData] = await Promise.all([
        projectService.getAll(),
        photoService.getAll()
      ])
      
      setProjects(projectsData)
      setPhotos(photosData)
    } catch (err) {
      setError('Failed to load data')
      console.error('Reports error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadData()
  }

  const handleGenerateReport = async () => {
    if (!selectedProject) {
      toast.error('Please select a project')
      return
    }

    try {
      setGenerating(true)
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Report generated successfully!')
      
      // In a real app, this would download the report
      const project = projects.find(p => p.Id === parseInt(selectedProject))
      const projectPhotos = photos.filter(p => p.projectId === parseInt(selectedProject))
      
      console.log('Generated report for:', project.name)
      console.log('Photos included:', projectPhotos.length)
      
    } catch (err) {
      console.error('Failed to generate report:', err)
      toast.error('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return <Loading type="generic" />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.name
  }))

  const reportTypeOptions = [
    { value: 'summary', label: 'Project Summary' },
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'progress', label: 'Progress Report' },
    { value: 'photo-gallery', label: 'Photo Gallery' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const selectedProjectData = projects.find(p => p.Id === parseInt(selectedProject))
  const selectedProjectPhotos = photos.filter(p => p.projectId === parseInt(selectedProject))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary font-display">
            Reports
          </h1>
          <p className="text-gray-600 mt-2 font-body">
            Generate professional reports from your project data
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <Empty
          type="reports"
          message="No projects available to generate reports from."
          actionText="Create Project"
          onAction={() => {/* Handle create project */}}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-secondary mb-4 font-display">
                Report Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>
                  <Select
                    options={projectOptions}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    placeholder="Choose a project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <Select
                    options={reportTypeOptions}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <Select
                    options={dateRangeOptions}
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                </div>
                
                {dateRange === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <Input type="date" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Report Preview */}
            {selectedProjectData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-secondary mb-4 font-display">
                  Report Preview
                </h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-secondary">
                      {selectedProjectData.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {selectedProjectData.clientName} • {selectedProjectData.address}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {selectedProjectPhotos.length}
                      </p>
                      <p className="text-sm text-gray-600">Photos</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-accent">
                        {selectedProjectData.teamMembers.length}
                      </p>
                      <p className="text-sm text-gray-600">Team Members</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {Math.floor(Math.random() * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Progress</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-warning">
                        {Math.floor(Math.random() * 30)}
                      </p>
                      <p className="text-sm text-gray-600">Days Active</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-secondary mb-2">
                      Recent Photos
                    </h5>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProjectPhotos.slice(0, 4).map((photo) => (
                        <div
                          key={photo.Id}
                          className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                        >
                          <ApperIcon name="Camera" size={20} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Report Templates */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-secondary mb-4 font-display">
                Report Templates
              </h3>
              
              <div className="space-y-3">
                {reportTypeOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      reportType === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setReportType(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon 
                        name={
                          option.value === 'summary' ? 'FileText' :
                          option.value === 'detailed' ? 'FileSpreadsheet' :
                          option.value === 'progress' ? 'TrendingUp' : 'Camera'
                        } 
                        size={24} 
                        className={reportType === option.value ? 'text-primary' : 'text-gray-400'} 
                      />
                      <div>
                        <h4 className="font-medium text-secondary">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.value === 'summary' && 'Overview of project status'}
                          {option.value === 'detailed' && 'Comprehensive project analysis'}
                          {option.value === 'progress' && 'Timeline and progress tracking'}
                          {option.value === 'photo-gallery' && 'Visual documentation'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Generate Report */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-secondary mb-4 font-display">
                Generate Report
              </h3>
              
              <div className="space-y-4">
                <Button
                  variant="primary"
                  onClick={handleGenerateReport}
                  disabled={generating || !selectedProject}
                  className="w-full btn-hover"
                >
                  {generating ? (
                    <>
                      <ApperIcon name="Loader" size={20} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Download" size={20} className="mr-2" />
                      Generate PDF Report
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Report will include:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Project overview and details</li>
                    <li>Photo documentation</li>
                    <li>Team member information</li>
                    <li>Progress timeline</li>
                    <li>Annotations and notes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-secondary mb-4 font-display">
                Export Options
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Mail" size={16} className="mr-2" />
                  Email Report
                </Button>
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Share" size={16} className="mr-2" />
                  Share Link
                </Button>
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Export to Cloud
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports