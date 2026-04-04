import mysql from "mysql2/promise"

const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined
}

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  try {
    const parsed = new URL(databaseUrl)
    if (!parsed.username) {
      throw new Error("DATABASE_URL must include a database username")
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("DATABASE_URL is not a valid URL")
    }
    throw error
  }

  return databaseUrl
}

export const pool =
  globalForDb.pool ??
  mysql.createPool({
    uri: getDatabaseUrl(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params as any)
  return rows as T[]
}

export async function queryOne<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] || null
}

export async function execute(
  sql: string,
  params?: unknown[]
): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, params as any)
  return result as mysql.ResultSetHeader
}
