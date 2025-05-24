// app/api/me/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db' // assuming your Prisma client is exported here

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        hasCompletedSurvey: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
