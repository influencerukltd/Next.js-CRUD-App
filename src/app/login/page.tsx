import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Login | CRUD',
  description: 'Sign in to access the CRUD application',
}

export default async function LoginPage() {
  // Redirect to home if already logged in
  const session = await getSession()
  if (session) {
    redirect('/')
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <LoginForm />
    </main>
  )
}
