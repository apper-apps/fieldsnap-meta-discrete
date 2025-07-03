import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout