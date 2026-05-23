import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Interview from './pages/Interview'
import Results from './pages/Results'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute><Schedule /></ProtectedRoute>
        } />
        <Route path="/interview/:id" element={
          <ProtectedRoute><Interview /></ProtectedRoute>
        } />
        <Route path="/results/:id" element={
          <ProtectedRoute><Results /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App