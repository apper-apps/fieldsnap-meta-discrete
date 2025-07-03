import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { teamService } from '@/services/api/teamService'
import { projectService } from '@/services/api/projectService'

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'member',
    projects: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [teamData, projectsData] = await Promise.all([
        teamService.getAll(),
        projectService.getAll()
      ])
      
      setTeamMembers(teamData)
      setProjects(projectsData)
    } catch (err) {
      setError('Failed to load team data')
      console.error('Team error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadData()
  }

  const handleInviteMember = async (e) => {
    e.preventDefault()
    
    if (!inviteForm.name || !inviteForm.email) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await teamService.create(inviteForm)
      toast.success('Team member invited successfully!')
      setShowInviteModal(false)
      setInviteForm({ name: '', email: '', role: 'member', projects: [] })
      loadData()
    } catch (err) {
      console.error('Failed to invite member:', err)
      toast.error('Failed to invite team member')
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return

    try {
      await teamService.delete(memberId)
      toast.success('Team member removed successfully!')
      loadData()
    } catch (err) {
      console.error('Failed to remove member:', err)
      toast.error('Failed to remove team member')
    }
  }

  if (loading) {
    return <Loading type="generic" />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'member', label: 'Team Member' },
    { value: 'viewer', label: 'Viewer' }
  ]

  const getRoleVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'manager':
        return 'warning'
      case 'member':
        return 'primary'
      case 'viewer':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return 'Shield'
      case 'manager':
        return 'Crown'
      case 'member':
        return 'User'
      case 'viewer':
        return 'Eye'
      default:
        return 'User'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary font-display">
            Team Management
          </h1>
          <p className="text-gray-600 mt-2 font-body">
            Manage your project team members and their permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowInviteModal(true)}
          className="btn-hover"
        >
          <ApperIcon name="UserPlus" size={20} className="mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Members</p>
              <p className="text-3xl font-bold text-secondary">{teamMembers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-xl">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold text-secondary">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-xl">
              <ApperIcon name="FolderOpen" size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Administrators</p>
              <p className="text-3xl font-bold text-secondary">
                {teamMembers.filter(m => m.role === 'admin').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-error to-error/80 p-4 rounded-xl">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Online Now</p>
              <p className="text-3xl font-bold text-secondary">
                {Math.floor(teamMembers.length * 0.6)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-success to-success/80 p-4 rounded-xl">
              <ApperIcon name="Activity" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h2 className="text-2xl font-bold text-secondary mb-6 font-display">
          Team Members
        </h2>

        {teamMembers.length === 0 ? (
          <Empty
            type="team"
            onAction={() => setShowInviteModal(true)}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                      Member
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                      Projects
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <motion.tr
                      key={member.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-secondary">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={getRoleVariant(member.role)}
                          icon={getRoleIcon(member.role)}
                        >
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="FolderOpen" size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {member.projects.length} projects
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={Math.random() > 0.5 ? 'success' : 'secondary'}
                          icon={Math.random() > 0.5 ? 'Circle' : 'Circle'}
                        >
                          {Math.random() > 0.5 ? 'Online' : 'Offline'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.Id)}
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary font-display">
                Invite Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Select
                  options={roleOptions}
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-hover"
                >
                  <ApperIcon name="Send" size={16} className="mr-2" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Team