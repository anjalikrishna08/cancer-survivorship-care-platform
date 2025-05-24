import { NextResponse } from 'next/server'
import { authService } from '@/lib/auth'
import { setAuthCookies, createToken } from '@/lib/server-token'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await authService.login(email, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    if (result.user) {
      const token = await createToken(result.user)
      setAuthCookies(result.user, token)
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 