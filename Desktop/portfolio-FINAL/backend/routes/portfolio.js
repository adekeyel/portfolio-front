import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function rowToItem(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    stack: row.stack || [],
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    link: row.link,
    featured: row.featured,
    createdAt: row.created_at
  }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio_items ORDER BY sort_order ASC, created_at ASC')
    res.json(result.rows.map(rowToItem))
  } catch (err) {
    console.error('Get portfolio error:', err)
    res.status(500).json({ error: 'Failed to fetch portfolio' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { title, subtitle, description, stack, mediaType, mediaUrl, link, featured } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const id = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM portfolio_items')
    const sortOrder = Number(countResult.rows[0].count)

    await pool.query(
      `INSERT INTO portfolio_items (id, title, subtitle, description, stack, media_type, media_url, link, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, title, subtitle || '', description || '', JSON.stringify(stack || []), mediaType || 'image', mediaUrl || '', link || '', !!featured, sortOrder]
    )
    const result = await pool.query('SELECT * FROM portfolio_items WHERE id = $1', [id])
    res.status(201).json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Create portfolio item error:', err)
    res.status(500).json({ error: 'Failed to create portfolio item' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { title, subtitle, description, stack, mediaType, mediaUrl, link, featured } = req.body

  try {
    const result = await pool.query(
      `UPDATE portfolio_items SET
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        description = COALESCE($3, description),
        stack = COALESCE($4, stack),
        media_type = COALESCE($5, media_type),
        media_url = COALESCE($6, media_url),
        link = COALESCE($7, link),
        featured = COALESCE($8, featured)
       WHERE id = $9 RETURNING *`,
      [title, subtitle, description, stack ? JSON.stringify(stack) : null, mediaType, mediaUrl, link, featured, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Update portfolio item error:', err)
    res.status(500).json({ error: 'Failed to update portfolio item' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM portfolio_items WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete portfolio item error:', err)
    res.status(500).json({ error: 'Failed to delete portfolio item' })
  }
})

export default router
