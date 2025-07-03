import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen = true, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'Home' },
    { name: 'Projects', href: '/', icon: 'FolderOpen' },
    { name: 'Photos', href: '/', icon: 'Camera' },
    { name: 'Team', href: '/team', icon: 'Users' },
    { name: 'Reports', href: '/reports', icon: 'FileText' },
  ]

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
          isActive || location.pathname === item.href
            ? 'bg-primary text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      <ApperIcon name={item.icon} size={20} />
      <span className="font-medium">{item.name}</span>
    </NavLink>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-secondary border-r border-gray-700">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="bg-primary p-2 rounded-lg">
            <ApperIcon name="Camera" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-display">
              FieldSnap Pro
            </h1>
            <p className="text-gray-400 text-sm">
              Project Documentation
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-400">Project Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="w-80 h-full bg-secondary shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <ApperIcon name="Camera" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-display">
                    FieldSnap Pro
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Project Documentation
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-400">Project Manager</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default Sidebar