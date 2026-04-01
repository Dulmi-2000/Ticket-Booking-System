import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { JWTPayload, AuthSession, UserRole } from "./types"

// Decode the Base64 secret to match the backend's encoding
const JWT_SECRET = Uint8Array.from(
  atob(process.env.JWT_SECRET || "Ym9va2luZy1zeXN0ZW0tc2VjcmV0LWtleS0xMjM0NTY3ODkwMTIzNDU2"),
  (c) => c.charCodeAt(0)
)

const COOKIE_NAME = "auth_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createToken(
  userId: string,
  email: string,
  role: UserRole
): Promise<string> {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const jwtPayload = payload as any
    return {
      userId: String(jwtPayload.userId),
      email: jwtPayload.email || jwtPayload.sub,
      role: jwtPayload.role,
      exp: jwtPayload.exp,
      iat: jwtPayload.iat,
    } as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return {
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.email.split("@")[0],
      role: (payload.role?.toLowerCase() as UserRole) || "user",
    },
    token,
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth()
  if (session.user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return session
}
