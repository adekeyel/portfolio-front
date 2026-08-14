import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import portfolioRoutes from './routes/portfolio.js'
import servicesRoutes from './routes/services.js'
import bookingsRoutes from './routes/bookings.js'
import jobsRoutes from './routes/jobs.js'
import testimonialsRoutes from './routes/testimonials.js'
import contactRoutes from './routes/contact.js'
import legalRoutes from './routes/legal.js'
import uploadsRoutes from './routes/uploads.js'
import paymentsRoutes from './routes/payments.js'

dotenv.config()

const app = express()

// Allow the webhook routes to access the raw request body (needed to
// verify Paystack/Flutterwave signatures) while every other route gets
// normal parsed JSON.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/payments/webhook')) {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      req.rawBody = data
      try { req.body = JSON.parse(data) } catch { req.body = {} }
      next()
    })
  } else {
    express.json({ limit: '2mb' })(req, res, next)
  }
})

app.use(helmet({ crossOriginResourcePolicy: false }))

// CORS: allow your deployed frontend origin(s). Set FRONTEND_URL in your
// Railway environment variables to your exact deployed frontend URL.
// Multiple origins can be comma-separated if needed, e.g.:
//   FRONTEND_URL=https://4go-tech.vercel.app,https://www.4gotechnology.com
function normalizeOrigin(url) {
  return (url || '').trim().replace(/\/+$/, '') // strip trailing slash(es)
}

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || '').split(',').map(normalizeOrigin).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:4173'
]

console.log('[CORS] Allowed origins:', allowedOrigins)

app.use(cors({
  origin: (origin, callback) => {
    // Requests with no Origin header (curl, server-to-server calls,
    // Postman, the webhook endpoints) are always allowed.
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true)
    }

    // Reject WITHOUT throwing — this avoids dumping a full stack trace
    // into the logs for every blocked request. `callback(null, false)`
    // tells the cors package to simply omit the CORS header, which the
    // browser then blocks client-side — same end result, clean logs.
    console.warn(`[CORS] Blocked request from origin: ${origin}`)
    return callback(null, false)
  },
  credentials: true
}))

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/legal', legalRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/payments', paymentsRoutes)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
