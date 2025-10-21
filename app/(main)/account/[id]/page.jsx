import { getAccountWithTransactions } from '@/actions/account'
import { formatCurrency } from '@/lib/currency'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import AccountChart from '../_components/account-chart'
import TransactionTable from '../_components/transaction-table'

export default async function AccountPage({ params }) {
  const { id } = await params
  const accountData = await getAccountWithTransactions(id)

  if (!accountData) {
    notFound()
  }

  const { transactions, ...account } = accountData

  return (
    <div className="space-y-8">
      {/* Account Header */}
      <div className="financial-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                account.type === 'CURRENT'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400'
              }`}
            >
              <span className="font-bold text-xl">
                {account.type === 'CURRENT' ? 'C' : 'S'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl gradient-title font-bold tracking-tight capitalize">
                {account.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{' '}
                Account
              </p>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <div className="text-4xl font-bold text-foreground mb-2">
              {formatCurrency(account.balance)}
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-4 text-sm text-muted-foreground">
              <span>{account._count.transactions} Transactions</span>
              <span>•</span>
              <span>Active Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={
          <div className="financial-card p-8">
            <div className="flex items-center justify-center py-12">
              <BarLoader width={'100%'} color="var(--primary)" />
            </div>
          </div>
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Transactions
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Real-time</span>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="financial-card p-8">
              <div className="flex items-center justify-center py-12">
                <BarLoader width={'100%'} color="var(--primary)" />
              </div>
            </div>
          }
        >
          <TransactionTable transactions={transactions} />
        </Suspense>
      </div>
    </div>
  )
}
