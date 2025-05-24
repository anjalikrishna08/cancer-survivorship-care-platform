// This file acts as a facade to use the appropriate token utility based on the environment
import { SignJWT, jwtVerify } from 'jose'
import { User } from './auth'

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key')

// In client components, use client-token
export * from './client-token'

// In server components or API routes, use server-token
// export { createToken, verifyToken, setAuthCookies } from './server-token'

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
  if (typeof document === 'undefined') return
  
  // Set session cookie
  document.cookie = `session=${token}; path=/; max-age=86400; secure; samesite=strict`
  
  // Set user data cookie (excluding password)
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType,
    hasCompletedSurvey: user.hasCompletedSurvey,
    hasCarePlan: user.hasCarePlan
  }
  document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=86400; secure; samesite=strict`
}

export function getAuthData() {
  if (typeof document === 'undefined') return null
  
  const userDataCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('userData='))
    ?.split('=')[1]

  if (!userDataCookie) return null

  try {
    return JSON.parse(decodeURIComponent(userDataCookie))
  } catch (error) {
    return null
  }
}

export function clearAuthCookies() {
  if (typeof document === 'undefined') return
  
  document.cookie = 'session=; path=/; max-age=0'
  document.cookie = 'userData=; path=/; max-age=0'
} 