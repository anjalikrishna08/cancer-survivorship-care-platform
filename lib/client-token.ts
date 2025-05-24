import { User } from './auth'

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