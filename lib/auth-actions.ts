'use server'

import { registerUser, loginUser } from './auth-service'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleRegister(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  userType: 'patient' | 'admin'
}) {
  try {
    const result = await registerUser(data)

    if (!result.success || !result.user) {
      return { success: false, error: result.error ?? 'Unknown error' }
    }

    const cookieStore = cookies()
    cookieStore.set('user_id', result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, userType: result.user.userType }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Failed to create account' }
  }
}

export async function handleLogin(data: { email: string; password: string }) {
  try {
    const result = await loginUser(data)

    if (!result.success || !result.user) {
      return { success: false, error: result.error ?? 'Unknown error' }
    }

    const cookieStore = cookies()
    cookieStore.set('user_id', result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, userType: result.user.userType }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Failed to login' }
  }
}

export async function handleLogout() {
  const cookieStore = cookies()
  cookieStore.delete('user_id')
  redirect('/auth/login')
}
