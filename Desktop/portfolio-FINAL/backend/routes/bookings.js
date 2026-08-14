import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Prevent the public booking form from being used to spam the DB.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many submissions from this device. Please try again later.' }
})

function rowToItem(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    budget: row.budget,
    details: row.details,
    preferredDate: row.preferred_date,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference,
    amountKobo: row.amount_kobo,
    createdAt: row.created_at
  }
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

// PUBLIC — anyone can submit a booking request
router.post('/', submitLimiter, async (req, res) => {
  const { name, email, phone, service, budget, details, preferredDate } = req.body

  if (!name || !isValidEmail(email) || !service) {
    return res.status(400).json({ error: 'Name, a valid email, and a service selection are required' })
  }

  const id = 'b_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  try {
    await pool.query(
      `INSERT INTO bookings (id, name, email, phone, service, budget, details, preferred_date, status, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending','unpaid')`,
      [id, name, email, phone || '', service, budget || '', details || '', preferredDate || '']
    )
    res.status(201).json({ id })
  } catch (err) {
    console.error('Create booking error:', err)
    res.status(500).json({ error: 'Failed to submit booking' })
  }
})

// ADMIN — view all bookings
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC')
    res.json(result.rows.map(rowToItem))
  } catch (err) {
    console.error('Get bookings error:', err)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// ADMIN — update status / payment status
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { status, paymentStatus, amountKobo } = req.body

  try {
    const result = await pool.query(
      `UPDATE bookings SET
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        amount_kobo = COALESCE($3, amount_kobo)
       WHERE id = $4 RETURNING *`,
      [status, paymentStatus, amountKobo, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rowToItem(result.rows[0]))
  } catch (err) {
    console.error('Update booking error:', err)
    res.status(500).json({ error: 'Failed to update booking' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete booking error:', err)
    res.status(500).json({ error: 'Failed to delete booking' })
  }
})

export default router
