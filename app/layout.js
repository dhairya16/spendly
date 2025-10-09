import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spendly',
  description: 'Manage your expense & Spend Wisely',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen mt-20">{children}</main>
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <p>Made with ❤️ by spendly</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
