import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { normalizeUserRole } from "@/lib/roles"
import type { UserRole } from "@/lib/types"

const JWT_SECRET = Uint8Array.from(
  atob(process.env.JWT_SECRET || "Ym9va2luZy1zeXN0ZW0tc2VjcmV0LWtleS0xMjM0NTY3ODkwMTIzNDU2"),
  (c) => c.charCodeAt(0)
)

/** null = missing / invalid token or no role claim (let the app decide). */
async function getRoleFromCookie(token?: string): Promise<UserRole | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const raw = (payload as Record<string, unknown>).role
    if (raw === undefined || raw === null || raw === "") return null
    return normalizeUserRole(raw)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const token = request.cookies.get("auth_token")?.value
    const role = await getRoleFromCookie(token)

    const isAdminRoute = pathname.startsWith("/admin")
    const isUserDashboard = pathname.startsWith("/dashboard")
    const isHome = pathname === "/"

    if (role === "admin" && (isHome || isUserDashboard)) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    if (isAdminRoute && role !== null && role !== "admin") {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
}
