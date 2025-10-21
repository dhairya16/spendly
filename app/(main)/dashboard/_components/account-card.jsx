'use client'

import { updateDefaultAccount } from '@/actions/account'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'
import { formatCurrency } from '@/lib/currency'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount)

  const handleDefaultChange = async (event) => {
    event.preventDefault() // Prevent navigation

    if (isDefault) {
      toast.warning('You need atleast 1 default account')
      return // Don't allow toggling off the default account
    }

    await updateDefaultFn(id)
  }

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success('Default account updated successfully')
    }
  }, [updatedAccount])

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to update default account')
    }
  }, [error])

  return (
    <Card className="financial-card group relative overflow-hidden">
      <Link href={`/account/${id}`} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                type === 'CURRENT'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400'
              }`}
            >
              <span className="font-bold text-sm">
                {type === 'CURRENT' ? 'C' : 'S'}
              </span>
            </div>
            <div>
              <CardTitle className="text-base font-semibold capitalize text-foreground">
                {name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {type.charAt(0) + type.slice(1).toLowerCase()} Account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDefault && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                Default
              </span>
            )}
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(balance)}
              </span>
              <span className="text-sm text-muted-foreground">balance</span>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ArrowUpRight className="h-3 w-3 income-positive" />
                  <span className="text-xs font-medium income-positive">
                    Income
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ArrowDownRight className="h-3 w-3 expense-negative" />
                  <span className="text-xs font-medium expense-negative">
                    Expense
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
