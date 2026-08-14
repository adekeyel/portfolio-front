import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * FILE UPLOADS — Cloudinary
 * -----------------------------------------------------------------------
 * Portfolio images/videos are uploaded directly to Cloudinary, not saved
 * to this server's local disk. This matters because Railway's filesystem
 * is ephemeral — anything written to local disk is wiped on every
 * redeploy, restart, or crash. Cloudinary storage persists independently
 * of your backend's lifecycle, so uploads survive deploys.
 *
 * Set these three environment variables (Railway → your backend service
 * → Variables), all found on your Cloudinary dashboard home page after
 * you sign up at cloudinary.com (free tier is generous for this use case):
 *
 *   CLOUDINARY_CLOUD_NAME=your-cloud-name
 *   CLOUDINARY_API_KEY=your-api-key
 *   CLOUDINARY_API_SECRET=your-api-secret
 *
 * Until all three are set, uploads return a clear 501 error rather than
 * silently failing or writing to a disk that won't persist.
 * -----------------------------------------------------------------------
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Files are held in memory just long enough to stream to Cloudinary —
// never written to this server's disk at any point.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — generous for short preview videos
  fileFilter: (req, file, cb) => {
    const allowed = /^(image|video)\//
    if (allowed.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only image or video files are allowed'))
  }
})

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio', resource_type: resourceType },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const configured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  if (!configured) {
    return res.status(501).json({ error: 'Cloudinary is not configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.' })
  }

  const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image'

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, mediaType)
    res.status(201).json({ url: result.secure_url, mediaType })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(502).json({ error: 'Upload to Cloudinary failed. Check your Cloudinary credentials.' })
  }
})

export default router
