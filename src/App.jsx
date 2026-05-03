import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import RoadmapPage from './pages/RoadmapPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#0f0f13]">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/roadmap/:id" element={<RoadmapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a24',
            color: '#f3f4f6',
            border: '1px solid #2a2a3a',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
