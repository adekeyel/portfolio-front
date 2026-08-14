import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT privacy_policy, terms_of_service FROM legal_pages WHERE id = 1')
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json({
      privacyPolicy: result.rows[0].privacy_policy,
      termsOfService: result.rows[0].terms_of_service
    })
  } catch (err) {
    console.error('Get legal error:', err)
    res.status(500).json({ error: 'Failed to fetch legal pages' })
  }
})

router.put('/', requireAuth, async (req, res) => {
  const { privacyPolicy, termsOfService } = req.body
  try {
    await pool.query(
      `INSERT INTO legal_pages (id, privacy_policy, terms_of_service, updated_at) VALUES (1, $1, $2, now())
       ON CONFLICT (id) DO UPDATE SET privacy_policy = $1, terms_of_service = $2, updated_at = now()`,
      [privacyPolicy, termsOfService]
    )
    res.json({ privacyPolicy, termsOfService })
  } catch (err) {
    console.error('Update legal error:', err)
    res.status(500).json({ error: 'Failed to update legal pages' })
  }
})

export default router
