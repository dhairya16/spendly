import { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import DashboardPage from './page'

export default function Layout() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl gradient-title md:text-5xl lg:text-6xl font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your finances and track your spending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={'100%'} color="#005b9e" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  )
}
