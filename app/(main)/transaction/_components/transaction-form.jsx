'use client'

import { createTransaction, updateTransaction } from '@/actions/transaction'
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import CreateAccountDrawer from '@/components/create-account-drawer'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

import ReceiptScanner from '@/app/(main)/transaction/_components/ReceiptScanner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/currency'

const TransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: 'EXPENSE',
            amount: '',
            description: '',
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  })

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction)

  const type = watch('type')
  const isRecurring = watch('isRecurring')
  const date = watch('date')

  const filteredCategories = categories.filter(
    (category) => category.type === type
  )

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    }

    if (editMode) {
      transactionFn(editId, formData)
    } else {
      transactionFn(formData)
    }
  }

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? 'Transaction updated successfully'
          : 'Transaction created successfully'
      )
      reset()
      router.push(`/account/${transactionResult.data.accountId}`)
    }
  }, [transactionResult, transactionLoading, editMode])

  const handleScanComplete = (scannedData) => {
    console.log(scannedData)
    if (scannedData) {
      setValue('amount', scannedData.amount.toString())
      setValue('date', new Date(scannedData.date))
      if (scannedData.description) {
        setValue('description', scannedData.description)
      }
      if (scannedData.category) {
        setValue('category', scannedData.category)
      }
      toast.success('Receipt scanned successfully')
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {/* ai receipt scanner */}
      {!editMode && (
        <div className="mb-6">
          <ReceiptScanner onScanComplete={handleScanComplete} />
        </div>
      )}

      {/* Transaction Type Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">1</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Transaction Type
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              type === 'EXPENSE'
                ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800'
                : 'border-border hover:border-muted-foreground/50'
            }`}
            onClick={() => setValue('type', 'EXPENSE')}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${type === 'EXPENSE' ? 'bg-red-500' : 'bg-muted-foreground'}`}
              ></div>
              <div>
                <p className="font-medium text-foreground">Expense</p>
                <p className="text-sm text-muted-foreground">Money going out</p>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              type === 'INCOME'
                ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
                : 'border-border hover:border-muted-foreground/50'
            }`}
            onClick={() => setValue('type', 'INCOME')}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${type === 'INCOME' ? 'bg-green-500' : 'bg-muted-foreground'}`}
              ></div>
              <div>
                <p className="font-medium text-foreground">Income</p>
                <p className="text-sm text-muted-foreground">Money coming in</p>
              </div>
            </div>
          </div>
        </div>
        {errors.type && (
          <p className="text-sm expense-negative">{errors.type.message}</p>
        )}
      </div>

      {/* Amount and Account Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">2</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Amount & Account
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="financial-card pl-8 text-lg"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-sm expense-negative">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Account
            </label>
            <Select
              onValueChange={(value) => setValue('accountId', value)}
              defaultValue={getValues('accountId')}
            >
              <SelectTrigger className="financial-card">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    Create Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm expense-negative">
                {errors.accountId.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category and Date Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">3</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Category & Date
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <Select
              onValueChange={(value) => setValue('category', value)}
              defaultValue={getValues('category')}
            >
              <SelectTrigger className="financial-card">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm expense-negative">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="financial-card w-full justify-start text-left font-normal"
                >
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setValue('date', date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm expense-negative">{errors.date.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">4</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Description</h3>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Enter a description for this transaction"
            className="financial-card text-lg"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm expense-negative">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Recurring Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">5</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Recurring Options
          </h3>
        </div>

        <div className="flex flex-row items-center justify-between financial-card p-6">
          <div className="space-y-1">
            <label className="text-base font-medium text-foreground">
              Recurring Transaction
            </label>
            <div className="text-sm text-muted-foreground">
              Set up a recurring schedule for this transaction
            </div>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue('isRecurring', checked)}
          />
        </div>

        {/* Recurring Interval */}
        {isRecurring && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Recurring Interval
            </label>
            <Select
              onValueChange={(value) => setValue('recurringInterval', value)}
              defaultValue={getValues('recurringInterval')}
            >
              <SelectTrigger className="financial-card">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm expense-negative">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            className="financial-card flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="financial-primary flex-1 text-lg py-3"
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : editMode ? (
              'Update Transaction'
            ) : (
              'Create Transaction'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default TransactionForm
