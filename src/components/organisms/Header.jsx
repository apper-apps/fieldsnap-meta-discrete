import { useState } from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuToggle }) => {
  const [notifications] = useState([
    { id: 1, message: 'New photo uploaded to Project Alpha', time: '5 min ago' },
    { id: 2, message: 'Team member added to Project Beta', time: '1 hour ago' },
    { id: 3, message: 'Report generated for Project Gamma', time: '2 hours ago' },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search projects, photos..."
              className="w-96"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/capture">
            <Button variant="primary" className="btn-hover">
              <ApperIcon name="Camera" size={20} className="mr-2" />
              Capture
            </Button>
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="Bell" size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-secondary">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm text-secondary mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar placeholder="Search projects, photos..." />
      </div>
    </header>
  )
}

export default Header