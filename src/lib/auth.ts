import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/server/db'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Simple session token generation
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: number): Promise<void> {
  const token = generateSessionToken()
  const cookieStore = await cookies()
  
  // Store session token in cookie (in production, you'd also store this in a database)
  cookieStore.set(SESSION_COOKIE_NAME, `${userId}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<{ userId: number } | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return null
  }
  
  const [userIdStr] = sessionCookie.value.split(':')
  const userId = parseInt(userIdStr || '', 10)
  
  if (isNaN(userId)) {
    return null
  }
  
  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  
  if (!user) {
    return null
  }
  
  return { userId: user.id }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true },
  })
  
  return user
}
