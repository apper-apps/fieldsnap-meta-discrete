import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import ProjectDetail from '@/components/pages/ProjectDetail'
import PhotoCapture from '@/components/pages/PhotoCapture'
import PhotoViewer from '@/components/pages/PhotoViewer'
import Reports from '@/components/pages/Reports'
import Team from '@/components/pages/Team'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="capture" element={<PhotoCapture />} />
          <Route path="photos/:photoId" element={<PhotoViewer />} />
          <Route path="reports" element={<Reports />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App