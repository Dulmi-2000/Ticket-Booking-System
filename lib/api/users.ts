import { backendPost } from "./client"
import type { User, UserRole } from "../types"

interface BackendAuthResponse {
  token: string
  userId: number
  fullName: string
  email: string
  role: string
}

function mapUser(res: BackendAuthResponse): User {
  const now = new Date()
  return {
    id: String(res.userId),
    email: res.email,
    name: res.fullName,
    password_hash: "",
    role: res.role === "ADMIN" ? "admin" : "user",
    created_at: now,
    updated_at: now,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  // Not directly available; auth is handled via login/register
  return null
}

export async function getUserById(id: string): Promise<User | null> {
  return null
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "user"
): Promise<User & { backendToken: string }> {
  const res = await backendPost<BackendAuthResponse>("/api/auth/register", {
    fullName: name,
    email,
    password,
  })
  return { ...mapUser(res), backendToken: res.token }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; backendToken: string }> {
  const res = await backendPost<BackendAuthResponse>("/api/auth/login", {
    email,
    password,
  })
  return { user: mapUser(res), backendToken: res.token }
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // Password verification is done by the backend
  return false
}

export async function getAllUsers(): Promise<User[]> {
  return []
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<void> {
  // Would need a backend endpoint
}
