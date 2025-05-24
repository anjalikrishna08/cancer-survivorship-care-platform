import { SignJWT, jwtVerify } from 'jose'
import { User } from './auth'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key')

export async function createToken(user: User) {
  const token = await new SignJWT({ 
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType,
    hasCompletedSurvey: user.hasCompletedSurvey,
    hasCarePlan: user.hasCarePlan
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as {
      id: string
      email: string
      name: string
      userType: string
      hasCompletedSurvey: boolean
      hasCarePlan: boolean
    }
  } catch (error) {
    return null
  }
}

export function setAuthCookies(user: User, token: string) {
  const cookieStore = cookies()
  
  // Set session cookie
  cookieStore.set('session', token, {
    path: '/',
    maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  
  // Set user data cookie (excluding password)
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType,
    hasCompletedSurvey: user.hasCompletedSurvey,
    hasCarePlan: user.hasCarePlan
  }
  cookieStore.set('userData', JSON.stringify(userData), {
    path: '/',
    maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export function getAuthData() {
  const cookieStore = cookies()
  const userDataCookie = cookieStore.get('userData')?.value

  if (!userDataCookie) return null

  try {
    return JSON.parse(userDataCookie)
  } catch (error) {
    return null
  }
}

export function clearAuthCookies() {
  const cookieStore = cookies()
  cookieStore.delete('session')
  cookieStore.delete('userData')
} 