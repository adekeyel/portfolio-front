import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

// Railway provides DATABASE_URL automatically when you add a PostgreSQL
// service and link it to this app. Locally, put the same variable in a
// .env file (see .env.example).
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL is not set. The server will start but all DB calls will fail until it is configured.')
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('railway')
    ? { rejectUnauthorized: false }
    : (process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false)
})

export async function query(text, params) {
  return pool.query(text, params)
}
