import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM profile WHERE id = 1')
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' })
    res.json(result.rows[0].data)
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

router.put('/', requireAuth, async (req, res) => {
  try {
    const current = await pool.query('SELECT data FROM profile WHERE id = 1')
    const merged = { ...(current.rows[0]?.data || {}), ...req.body }
    await pool.query(
      `INSERT INTO profile (id, data, updated_at) VALUES (1, $1, now())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()`,
      [JSON.stringify(merged)]
    )
    res.json(merged)
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
