import { getCurrentBudget } from '@/actions/budget'
import { getDashboardData, getUserAccounts } from '@/actions/dashboard'
import DashboardOverview from '@/app/(main)/dashboard/_components/DashboardOverview'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { AccountCard } from './_components/account-card'
import BudgetProgress from './_components/budget-progress'

const DashboardPage = async () => {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ])

  const defaultAccount = accounts?.find((account) => account.isDefault)

  let budgetData = null
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id)
  }

  return (
    <div className="space-y-8">
      {/* budget progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* accounts grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="financial-card cursor-pointer border-dashed border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  )
}

export default DashboardPage
