import { getUserAccounts } from '@/actions/dashboard'
import { getTransaction } from '@/actions/transaction'
import TransactionForm from '@/app/(main)/transaction/_components/transaction-form'
import { defaultCategories } from '@/data/categories'

const AddTransactionPage = async ({ searchParams }) => {
  const accounts = await getUserAccounts()

  const editId = searchParams?.edit

  let initialData = null
  if (editId) {
    const transaction = await getTransaction(editId)
    initialData = transaction
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            {editId ? 'Edit Transaction' : 'Add New Transaction'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {editId ? 'Edit' : 'Add'} Transaction
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {editId 
              ? 'Update your transaction details below' 
              : 'Track your income and expenses with detailed categorization'
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="financial-card p-6 md:p-8">
          <TransactionForm
            accounts={accounts}
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  )
}

export default AddTransactionPage
