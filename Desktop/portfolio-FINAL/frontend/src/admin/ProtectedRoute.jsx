import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthed, checking } = useAuth()
  if (checking) return null
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return children
}
