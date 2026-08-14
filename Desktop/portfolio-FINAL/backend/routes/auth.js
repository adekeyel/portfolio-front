import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { pool } from '../db/pool.js'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()

// Slow down brute-force password guessing on the login endpoint specifically.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken({ id: user.id, email: user.email })
    res.json({ token, email: user.email })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email })
})

router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters, and current password is required' })
  }

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE id = $1', [req.admin.id])
    const user = result.rows[0]
    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, req.admin.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

export default router
