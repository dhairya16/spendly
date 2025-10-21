import { checkUser } from '@/lib/checkUser'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, PenBox } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

const Header = async () => {
  await checkUser()

  return (
    <div className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-foreground">Spendly</span>
        </Link>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="financial-card">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="financial-primary flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="financial-card">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}

export default Header
