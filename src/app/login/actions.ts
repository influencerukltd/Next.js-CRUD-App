'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/server/db'
import { createSession, verifyPassword, hashPassword } from '@/lib/auth'

export type AuthResult = {
  error?: string
  success?: boolean
}

export async function login(formData: FormData): Promise<AuthResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { error: 'Invalid username or password' }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { error: 'Invalid username or password' }
    }

    await createSession(user.id)
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An error occurred during login' }
  }

  redirect('/')
}

export async function register(formData: FormData): Promise<AuthResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return { error: 'Username already exists' }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    await createSession(user.id)
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'An error occurred during registration' }
  }

  redirect('/')
}
