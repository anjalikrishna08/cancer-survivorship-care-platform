import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcryptjs'

const prisma = new PrismaClient()

export async function registerUser(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  userType: 'patient' | 'admin'
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: `${data.firstName} ${data.lastName}`,
        userType: data.userType
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Failed to create account' }
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    const isValid = await compare(data.password, user.password)

    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Failed to login' }
  }
}

export async function createCarePlan(data: {
  title: string
  description: string
  userId: string
}) {
  try {
    const carePlan = await prisma.carePlan.create({
      data: {
        name: data.title, // 👈 Use 'name' as per schema
        description: data.description,
        conditions: [],     // You can customize this if needed
        medications: [],    // You can customize this if needed
        userId: data.userId
      }
    })

    return { success: true, carePlan }
  } catch (error) {
    console.error('Care plan creation error:', error)
    return { success: false, error: 'Failed to create care plan' }
  }
}


export async function getCarePlans(userId: string) {
  try {
    const carePlans = await prisma.carePlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, carePlans }
  } catch (error) {
    console.error('Error fetching care plans:', error)
    return { success: false, error: 'Failed to fetch care plans' }
  }
} 