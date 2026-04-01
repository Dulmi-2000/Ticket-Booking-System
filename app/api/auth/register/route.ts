import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/api/users"
import { createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const { backendToken, ...user } = await createUser(email, password, name)
    
    // Prioritize the token from the backend
    const token = backendToken || await createToken(user.id, user.email, user.role)
    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    const message = error instanceof Error ? error.message : "Failed to register"
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
