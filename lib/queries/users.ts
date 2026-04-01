import { query, queryOne, execute } from "../db"
import type { User, UserRole } from "../types"
import bcrypt from "bcryptjs"

type DbRole = "USER" | "ADMIN"

interface UserRow {
  id: number
  email: string
  full_name: string
  password: string
  role: DbRole
}

function rowToUser(row: UserRow): User {
  const now = new Date()
  return {
    id: String(row.id),
    email: row.email,
    name: row.full_name,
    password_hash: row.password,
    role: row.role === "ADMIN" ? "admin" : "user",
    created_at: now,
    updated_at: now,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const row = await queryOne<UserRow>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )
  return row ? rowToUser(row) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const row = await queryOne<UserRow>(
    "SELECT * FROM users WHERE id = ?",
    [Number(id)]
  )
  return row ? rowToUser(row) : null
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "user"
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12)
  const dbRole: DbRole = role === "admin" ? "ADMIN" : "USER"

  await execute(
    `INSERT INTO users (email, full_name, password, role)
     VALUES (?, ?, ?, ?)`,
    [email, name, passwordHash, dbRole]
  )

  const user = await getUserByEmail(email)
  if (!user) throw new Error("Failed to create user")
  return user
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getAllUsers(): Promise<User[]> {
  const rows = await query<UserRow>("SELECT * FROM users ORDER BY id DESC")
  return rows.map(rowToUser)
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<void> {
  const dbRole: DbRole = role === "admin" ? "ADMIN" : "USER"
  await execute(
    "UPDATE users SET role = ? WHERE id = ?",
    [dbRole, Number(userId)]
  )
}
