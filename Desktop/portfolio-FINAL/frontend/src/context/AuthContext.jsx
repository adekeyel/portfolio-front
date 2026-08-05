import { createContext, useContext, useState, useEffect } from 'react'
import { api, getToken, setToken, clearToken } from '../data/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [adminEmail, setAdminEmail] = useState(null)

  useEffect(() => {
    verifySession()
  }, [])

  async function verifySession() {
    const token = getToken()
    if (!token) {
      setChecking(false)
      return
    }
    try {
      const me = await api.get('/api/auth/me')
      setAdminEmail(me.email)
      setIsAuthed(true)
    } catch {
      clearToken()
      setIsAuthed(false)
    } finally {
      setChecking(false)
    }
  }

  async function login(email, password) {
    try {
      const result = await api.post('/api/auth/login', { email, password })
      setToken(result.token)
      setAdminEmail(result.email)
      setIsAuthed(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  function logout() {
    clearToken()
    setIsAuthed(false)
    setAdminEmail(null)
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthed, checking, adminEmail, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
