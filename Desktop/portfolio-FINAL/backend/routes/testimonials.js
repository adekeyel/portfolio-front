import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function rowToItem(row) {
  return { id: row.id, name: row.name, role: row.role, quote: row.quote, rating: row.rating, createdAt: row.created_at }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC')
    res.json(result.rows.map(rowToItem))
  } catch (err) {
    console.error('Get testimonials error:', err)
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { name, role, quote, rating } = req.body
  if (!name || !quote) return res.status(400).json({ error: 'Name and quote are required' })

  const id = 't_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    await pool.query(
      'INSERT INTO testimonials (id, name, role, quote, rating) VALUES ($1,$2,$3,$4,$5)',
      [id, name, role || '', quote, rating || 5]
    )
    const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id])
    res.status(201).json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Create testimonial error:', err)
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const { name, role, quote, rating } = req.body
  try {
    const result = await pool.query(
      `UPDATE testimonials SET
        name = COALESCE($1, name), role = COALESCE($2, role),
        quote = COALESCE($3, quote), rating = COALESCE($4, rating)
       WHERE id = $5 RETURNING *`,
      [name, role, quote, rating, req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Update testimonial error:', err)
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete testimonial error:', err)
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
})

export default router
