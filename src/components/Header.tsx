import { getCurrentUser } from '@/lib/auth'
import { LogOut, User } from 'lucide-react'
import { logout } from '@/app/logout/actions'
import { Button } from './ui/Button'

export default async function Header() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <header className="mx-10 mb-6 flex items-center justify-between rounded-lg border bg-black p-4">
      <h1 className="text-xl font-bold">CRUD Application</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="h-4 w-4" />
          <span>{user.username}</span>
        </div>
        
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}
