'use server'

import { redirect } from 'next/navigation'
import { neon } from '@neondatabase/serverless'
import { createSession, verifyPassword, hashPassword } from '@/lib/auth'

const sql = neon(process.env.DATABASE_URL!)

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
    const users = await sql`SELECT id, username, password FROM users WHERE username = ${username}`

    if (users.length === 0) {
      return { error: 'Invalid username or password' }
    }

    const user = users[0] as { id: number; username: string; password: string }
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
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username}`

    if (existingUsers.length > 0) {
      return { error: 'Username already exists' }
    }

    const hashedPassword = await hashPassword(password)

    const newUsers = await sql`
      INSERT INTO users (username, password) 
      VALUES (${username}, ${hashedPassword}) 
      RETURNING id
    `

    const user = newUsers[0] as { id: number }
    await createSession(user.id)
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'An error occurred during registration' }
  }

  redirect('/')
}
