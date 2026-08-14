import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'
import { pool } from './pool.js'
import { DEFAULT_DATA } from './defaultData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function migrate() {
  console.log('Running schema...')
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  await pool.query(schema)
  console.log('✓ Schema applied')

  // Seed profile if empty
  const profileCheck = await pool.query('SELECT id FROM profile WHERE id = 1')
  if (profileCheck.rows.length === 0) {
    await pool.query('INSERT INTO profile (id, data) VALUES (1, $1)', [JSON.stringify(DEFAULT_DATA.profile)])
    console.log('✓ Seeded profile')
  }

  // Seed legal if empty
  const legalCheck = await pool.query('SELECT id FROM legal_pages WHERE id = 1')
  if (legalCheck.rows.length === 0) {
    await pool.query(
      'INSERT INTO legal_pages (id, privacy_policy, terms_of_service) VALUES (1, $1, $2)',
      [DEFAULT_DATA.legal.privacyPolicy, DEFAULT_DATA.legal.termsOfService]
    )
    console.log('✓ Seeded legal pages')
  }

  // Seed portfolio if empty
  const portfolioCheck = await pool.query('SELECT id FROM portfolio_items LIMIT 1')
  if (portfolioCheck.rows.length === 0) {
    for (const [i, item] of DEFAULT_DATA.portfolio.entries()) {
      await pool.query(
        `INSERT INTO portfolio_items (id, title, subtitle, description, stack, media_type, media_url, link, featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [item.id, item.title, item.subtitle, item.description, JSON.stringify(item.stack), item.mediaType, item.mediaUrl, item.link, item.featured, i]
      )
    }
    console.log('✓ Seeded portfolio')
  }

  // Seed services if empty
  const servicesCheck = await pool.query('SELECT id FROM services LIMIT 1')
  if (servicesCheck.rows.length === 0) {
    for (const [i, s] of DEFAULT_DATA.services.entries()) {
      await pool.query(
        `INSERT INTO services (id, name, price_from, duration, description, features, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [s.id, s.name, s.priceFrom, s.duration, s.description, JSON.stringify(s.features), i]
      )
    }
    console.log('✓ Seeded services')
  }

  // Seed testimonials if empty
  const testimonialsCheck = await pool.query('SELECT id FROM testimonials LIMIT 1')
  if (testimonialsCheck.rows.length === 0) {
    for (const t of DEFAULT_DATA.testimonials) {
      await pool.query(
        `INSERT INTO testimonials (id, name, role, quote, rating) VALUES ($1,$2,$3,$4,$5)`,
        [t.id, t.name, t.role, t.quote, t.rating]
      )
    }
    console.log('✓ Seeded testimonials')
  }

  // Seed jobs if empty
  const jobsCheck = await pool.query('SELECT id FROM jobs LIMIT 1')
  if (jobsCheck.rows.length === 0) {
    for (const j of DEFAULT_DATA.jobs) {
      await pool.query(
        `INSERT INTO jobs (id, title, type, location, description, active) VALUES ($1,$2,$3,$4,$5,$6)`,
        [j.id, j.title, j.type, j.location, j.description, j.active]
      )
    }
    console.log('✓ Seeded jobs')
  }

  // Seed admin user if none exists
  const adminCheck = await pool.query('SELECT id FROM admin_users LIMIT 1')
  if (adminCheck.rows.length === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!'
    const hash = await bcrypt.hash(defaultPassword, 10)
    await pool.query('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [defaultEmail, hash])
    console.log(`✓ Seeded admin user: ${defaultEmail} (password: ${defaultPassword} — CHANGE THIS after first login)`)
  }

  console.log('Migration complete.')
  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
