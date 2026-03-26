'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { login, register, type AuthState } from './actions'

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [loginState, loginAction, isLoginPending] = useActionState<AuthState, FormData>(
    login,
    {}
  )
  const [registerState, registerAction, isRegisterPending] = useActionState<AuthState, FormData>(
    register,
    {}
  )

  const state = isRegister ? registerState : loginState
  const action = isRegister ? registerAction : loginAction
  const isPending = isRegister ? isRegisterPending : isLoginPending

  return (
    <div className="w-full max-w-md rounded-lg border bg-black p-8">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {isRegister ? 'Create Account' : 'Sign In'}
      </h1>

      <form action={action} className="space-y-4">
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

        {state.error && (
          <div className="rounded-lg border border-red-600 bg-red-600/10 p-3 text-sm text-red-500">
            {state.error}
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
          onClick={() => setIsRegister(!isRegister)}
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          {isRegister ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
