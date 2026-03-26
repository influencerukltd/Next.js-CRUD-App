'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { login, register } from './actions'

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    
    startTransition(async () => {
      const result = isRegister 
        ? await register(formData) 
        : await login(formData)
      
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-black p-8">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {isRegister ? 'Create Account' : 'Sign In'}
      </h1>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
            className={cn(
              'flex w-full rounded-lg border bg-black px-3 py-2 text-sm outline-0 transition-colors duration-500 ease-out focus-visible:ring-1 focus-visible:ring-white'
            )}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            className={cn(
              'flex w-full rounded-lg border bg-black px-3 py-2 text-sm outline-0 transition-colors duration-500 ease-out focus-visible:ring-1 focus-visible:ring-white'
            )}
          />
        </div>

        {isRegister && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              className={cn(
                'flex w-full rounded-lg border bg-black px-3 py-2 text-sm outline-0 transition-colors duration-500 ease-out focus-visible:ring-1 focus-visible:ring-white'
              )}
            />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-600 bg-red-600/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isPending}>
          {isRegister ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
        </span>{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister)
            setError(null)
          }}
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          {isRegister ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
