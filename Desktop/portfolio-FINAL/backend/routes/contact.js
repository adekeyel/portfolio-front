import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 15 })

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return res.status(400).json({ error: 'Name, a valid email, and a message are required' })
  }

  const id = 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    await pool.query(
      'INSERT INTO contact_messages (id, name, email, message) VALUES ($1,$2,$3,$4)',
      [id, name, email, message]
    )
    // NOTE: For real email notifications when a message comes in, add a
    // transactional email call here (e.g. Resend, SendGrid, Postmark).
    res.status(201).json({ success: true })
  } catch (err) {
    console.error('Contact submit error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Get contact messages error:', err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

export default router
