import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const applyLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 })

function rowToJob(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    location: row.location,
    description: row.description,
    active: row.active,
    createdAt: row.created_at
  }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC')
    res.json(result.rows.map(rowToJob))
  } catch (err) {
    console.error('Get jobs error:', err)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { title, type, location, description, active } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const id = 'j_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    await pool.query(
      'INSERT INTO jobs (id, title, type, location, description, active) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, title, type || '', location || '', description || '', active !== false]
    )
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id])
    res.status(201).json(rowToJob(result.rows[0]))
  } catch (err) {
    console.error('Create job error:', err)
    res.status(500).json({ error: 'Failed to create job' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const { title, type, location, description, active } = req.body
  try {
    const result = await pool.query(
      `UPDATE jobs SET
        title = COALESCE($1, title), type = COALESCE($2, type),
        location = COALESCE($3, location), description = COALESCE($4, description),
        active = COALESCE($5, active)
       WHERE id = $6 RETURNING *`,
      [title, type, location, description, active, req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rowToJob(result.rows[0]))
  } catch (err) {
    console.error('Update job error:', err)
    res.status(500).json({ error: 'Failed to update job' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete job error:', err)
    res.status(500).json({ error: 'Failed to delete job' })
  }
})

// PUBLIC — job application submission
router.post('/:id/apply', applyLimiter, async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Name and a valid email are required' })
  }

  try {
    const jobResult = await pool.query('SELECT title FROM jobs WHERE id = $1', [req.params.id])
    const jobTitle = jobResult.rows[0]?.title || 'Unknown role'

    const id = 'ja_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    await pool.query(
      'INSERT INTO job_applications (id, job_title, name, email, message) VALUES ($1,$2,$3,$4,$5)',
      [id, jobTitle, name, email, message || '']
    )
    res.status(201).json({ success: true })
  } catch (err) {
    console.error('Job application error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
})

router.get('/applications/all', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Get applications error:', err)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

export default router
