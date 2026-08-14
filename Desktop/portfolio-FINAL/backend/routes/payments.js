import { Router } from 'express'
import crypto from 'crypto'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * PAYMENT INTEGRATION
 * -----------------------------------------------------------------------
 * This file is the ONLY place that talks to Paystack/Flutterwave/Monnify.
 * Drop your real secret keys into the environment variables below
 * (Railway → your service → Variables tab) and this route becomes fully
 * live — nothing else in the app needs to change.
 *
 *   PAYMENT_PROVIDER=paystack | flutterwave | monnify
 *
 *   PAYSTACK_SECRET_KEY=sk_live_xxx        (or sk_test_xxx while testing)
 *
 *   FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx
 *
 *   MONNIFY_API_KEY=MK_PROD_xxx            (or MK_TEST_xxx while testing)
 *   MONNIFY_SECRET_KEY=xxx
 *   MONNIFY_CONTRACT_CODE=xxx
 *   MONNIFY_BASE_URL=https://api.monnify.com   (sandbox: https://sandbox.monnify.com)
 *
 *   PUBLIC_APP_URL=https://your-frontend-domain.com
 *
 * Until keys are set, /initialize returns a clear 501 error instead of
 * silently pretending to charge someone — this is intentional so you
 * never accidentally "accept" a payment that was never processed.
 * -----------------------------------------------------------------------
 */

const PROVIDER = process.env.PAYMENT_PROVIDER || 'paystack'

// Monnify access tokens are valid for 1 hour — cache in memory rather
// than logging in on every single payment initialization.
let monnifyTokenCache = { token: null, expiresAt: 0 }

async function getMonnifyToken() {
  if (monnifyTokenCache.token && Date.now() < monnifyTokenCache.expiresAt) {
    return monnifyTokenCache.token
  }

  const apiKey = process.env.MONNIFY_API_KEY
  const secretKey = process.env.MONNIFY_SECRET_KEY
  const baseUrl = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com'

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` }
  })
  const data = await response.json()

  if (!data.requestSuccessful) {
    throw new Error(data.responseMessage || 'Monnify authentication failed')
  }

  monnifyTokenCache = {
    token: data.responseBody.accessToken,
    // Refresh a little early rather than cutting it exactly at 1 hour
    expiresAt: Date.now() + 55 * 60 * 1000
  }
  return monnifyTokenCache.token
}

router.post('/initialize', async (req, res) => {
  const { bookingId, email, amountKobo } = req.body

  if (!bookingId || !email || !amountKobo) {
    return res.status(400).json({ error: 'bookingId, email, and amountKobo are required' })
  }

  try {
    if (PROVIDER === 'paystack') {
      const secretKey = process.env.PAYSTACK_SECRET_KEY
      if (!secretKey) {
        return res.status(501).json({ error: 'Paystack is not configured yet. Set PAYSTACK_SECRET_KEY in your environment variables.' })
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amountKobo, // Paystack expects the smallest currency unit (kobo)
          reference: `${bookingId}_${Date.now()}`,
          callback_url: `${process.env.PUBLIC_APP_URL || ''}/booking/confirmed`,
          metadata: { bookingId }
        })
      })
      const data = await response.json()

      if (!data.status) {
        return res.status(502).json({ error: data.message || 'Paystack initialization failed' })
      }

      await pool.query('UPDATE bookings SET payment_reference = $1, amount_kobo = $2 WHERE id = $3', [data.data.reference, amountKobo, bookingId])
      return res.json({ authorizationUrl: data.data.authorization_url, reference: data.data.reference })
    }

    if (PROVIDER === 'flutterwave') {
      const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
      if (!secretKey) {
        return res.status(501).json({ error: 'Flutterwave is not configured yet. Set FLUTTERWAVE_SECRET_KEY in your environment variables.' })
      }

      const txRef = `${bookingId}_${Date.now()}`
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount: amountKobo / 100, // Flutterwave expects the major currency unit (Naira, not kobo)
          currency: 'NGN',
          redirect_url: `${process.env.PUBLIC_APP_URL || ''}/booking/confirmed`,
          customer: { email },
          meta: { bookingId }
        })
      })
      const data = await response.json()

      if (data.status !== 'success') {
        return res.status(502).json({ error: data.message || 'Flutterwave initialization failed' })
      }

      await pool.query('UPDATE bookings SET payment_reference = $1, amount_kobo = $2 WHERE id = $3', [txRef, amountKobo, bookingId])
      return res.json({ authorizationUrl: data.data.link, reference: txRef })
    }

    if (PROVIDER === 'monnify') {
      const apiKey = process.env.MONNIFY_API_KEY
      const secretKey = process.env.MONNIFY_SECRET_KEY
      const contractCode = process.env.MONNIFY_CONTRACT_CODE
      const baseUrl = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com'

      if (!apiKey || !secretKey || !contractCode) {
        return res.status(501).json({ error: 'Monnify is not configured yet. Set MONNIFY_API_KEY, MONNIFY_SECRET_KEY, and MONNIFY_CONTRACT_CODE in your environment variables.' })
      }

      const token = await getMonnifyToken()
      const paymentReference = `${bookingId}_${Date.now()}`

      const response = await fetch(`${baseUrl}/api/v1/merchant/transactions/init-transaction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountKobo / 100, // Monnify expects the major currency unit (Naira, not kobo)
          customerName: email.split('@')[0],
          customerEmail: email,
          paymentReference,
          paymentDescription: 'Project booking payment',
          currencyCode: 'NGN',
          contractCode,
          redirectUrl: `${process.env.PUBLIC_APP_URL || ''}/booking/confirmed`,
          metaData: { bookingId }
        })
      })
      const data = await response.json()

      if (!data.requestSuccessful) {
        return res.status(502).json({ error: data.responseMessage || 'Monnify initialization failed' })
      }

      await pool.query('UPDATE bookings SET payment_reference = $1, amount_kobo = $2 WHERE id = $3', [paymentReference, amountKobo, bookingId])
      return res.json({ authorizationUrl: data.responseBody.checkoutUrl, reference: paymentReference })
    }

    return res.status(400).json({ error: `Unknown PAYMENT_PROVIDER: ${PROVIDER}` })
  } catch (err) {
    console.error('Payment initialize error:', err)
    res.status(500).json({ error: 'Payment initialization failed' })
  }
})

// Paystack calls this after a payment completes. Configure this URL in
// your Paystack dashboard under Settings → API Keys & Webhooks.
router.post('/webhook/paystack', async (req, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return res.status(501).end()

  // Verify the request genuinely came from Paystack before trusting it.
  const signature = req.headers['x-paystack-signature']
  const hash = crypto.createHmac('sha512', secretKey).update(req.rawBody || '').digest('hex')
  if (hash !== signature) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const event = req.body
  if (event.event === 'charge.success') {
    const bookingId = event.data.metadata?.bookingId
    if (bookingId) {
      await pool.query("UPDATE bookings SET payment_status = 'paid' WHERE id = $1", [bookingId])
    }
  }
  res.sendStatus(200)
})

// Flutterwave calls this after a payment completes. Configure this URL
// in your Flutterwave dashboard under Settings → Webhooks, and set the
// same secret as FLW_WEBHOOK_HASH below.
router.post('/webhook/flutterwave', async (req, res) => {
  const expectedHash = process.env.FLW_WEBHOOK_HASH
  if (!expectedHash) return res.status(501).end()

  const signature = req.headers['verif-hash']
  if (!signature || signature !== expectedHash) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const event = req.body
  if (event.status === 'successful') {
    const bookingId = event.meta?.bookingId
    if (bookingId) {
      await pool.query("UPDATE bookings SET payment_status = 'paid' WHERE id = $1", [bookingId])
    }
  }
  res.sendStatus(200)
})

// Monnify calls this after a payment completes. Configure this URL in
// your Monnify dashboard under Developer → Webhook URLs → Transaction
// Completion.
router.post('/webhook/monnify', async (req, res) => {
  const secretKey = process.env.MONNIFY_SECRET_KEY
  if (!secretKey) return res.status(501).end()

  // Monnify signs the raw request body with HMAC-SHA512 using your
  // secret key, sent in the 'monnify-signature' header.
  const signature = req.headers['monnify-signature']
  const expectedHash = crypto.createHmac('sha512', secretKey).update(req.rawBody || '').digest('hex')
  if (!signature || expectedHash !== signature) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const { eventType, eventData } = req.body
  if (eventType === 'SUCCESSFUL_TRANSACTION' && eventData?.paymentStatus === 'PAID') {
    const bookingId = eventData.metaData?.bookingId
    if (bookingId) {
      await pool.query("UPDATE bookings SET payment_status = 'paid' WHERE id = $1", [bookingId])
    }
  }
  res.sendStatus(200)
})

// ADMIN — manually mark a booking as paid (for offline/bank transfer payments)
router.post('/mark-paid/:bookingId', requireAuth, async (req, res) => {
  try {
    await pool.query("UPDATE bookings SET payment_status = 'paid' WHERE id = $1", [req.params.bookingId])
    res.json({ success: true })
  } catch (err) {
    console.error('Mark paid error:', err)
    res.status(500).json({ error: 'Failed to update payment status' })
  }
})

export default router
