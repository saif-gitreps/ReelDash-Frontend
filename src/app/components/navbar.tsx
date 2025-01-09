'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Film, Bell } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-secondary border-b border-border px-4 py-2 flex justify-around items-center z-50">
      <Link href="/home" className={`flex items-center gap-2 ${pathname === '/home' ? 'yellow-accent' : 'text-muted-foreground'}`}>
        <Home className="h-6 w-6" />
        <span>Home</span>
      </Link>
      <Link href="/feed" className={`flex items-center gap-2 ${pathname === '/feed' ? 'yellow-accent' : 'text-muted-foreground'}`}>
        <Film className="h-6 w-6" />
        <span>Feed</span>
      </Link>
      <Link href="/updates" className={`flex items-center gap-2 ${pathname === '/updates' ? 'yellow-accent' : 'text-muted-foreground'}`}>
        <Bell className="h-6 w-6" />
        <span>Updates</span>
      </Link>
      <Link href="/profile/user1" className={`flex items-center gap-2 ${pathname.startsWith('/profile') ? 'yellow-accent' : 'text-muted-foreground'}`}>
        <User className="h-6 w-6" />
        <span>Profile</span>
      </Link>
    </nav>
  )
}

