import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function rowToItem(row) {
  return {
    id: row.id,
    name: row.name,
    priceFrom: row.price_from,
    duration: row.duration,
    description: row.description,
    features: row.features || [],
    createdAt: row.created_at
  }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, created_at ASC')
    res.json(result.rows.map(rowToItem))
  } catch (err) {
    console.error('Get services error:', err)
    res.status(500).json({ error: 'Failed to fetch services' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { name, priceFrom, duration, description, features } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const id = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM services')
    const sortOrder = Number(countResult.rows[0].count)

    await pool.query(
      `INSERT INTO services (id, name, price_from, duration, description, features, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, name, priceFrom || '', duration || '', description || '', JSON.stringify(features || []), sortOrder]
    )
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id])
    res.status(201).json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Create service error:', err)
    res.status(500).json({ error: 'Failed to create service' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { name, priceFrom, duration, description, features } = req.body

  try {
    const result = await pool.query(
      `UPDATE services SET
        name = COALESCE($1, name),
        price_from = COALESCE($2, price_from),
        duration = COALESCE($3, duration),
        description = COALESCE($4, description),
        features = COALESCE($5, features)
       WHERE id = $6 RETURNING *`,
      [name, priceFrom, duration, description, features ? JSON.stringify(features) : null, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Update service error:', err)
    res.status(500).json({ error: 'Failed to update service' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete service error:', err)
    res.status(500).json({ error: 'Failed to delete service' })
  }
})

export default router
