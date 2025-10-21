'use client'

import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
]

export default function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  )

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  )

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Calculate expense breakdown for current month
  const currentDate = new Date()
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return (
      t.type === 'EXPENSE' &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    )
  })

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category
    if (!acc[category]) {
      acc[category] = 0
    }
    acc[category] += transaction.amount
    return acc
  }, {})

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="financial-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="financial-card w-[160px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowDownRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No recent transactions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by adding your first transaction
                </p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {transaction.description || 'Untitled Transaction'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex items-center font-semibold text-sm px-2 py-1 rounded-md',
                        transaction.type === 'EXPENSE'
                          ? 'expense-negative bg-red-50 dark:bg-red-950/20'
                          : 'income-positive bg-green-50 dark:bg-green-950/20'
                      )}
                    >
                      {transaction.type === 'EXPENSE' ? (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      )}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">₹</span>
                </div>
              </div>
              <p className="text-muted-foreground">No expenses this month</p>
              <p className="text-sm text-muted-foreground mt-1">
                Track your spending to see insights
              </p>
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={30}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), name]}
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
