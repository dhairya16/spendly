import { getUserAccounts } from '@/actions/dashboard'
import TransactionForm from '@/app/(main)/transaction/_components/transaction-form'
import { defaultCategories } from '@/data/categories'

const AddTransactionPage = async () => {
  const accounts = await getUserAccounts()

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">Add Transaction</h1>
      </div>
      <TransactionForm
        accounts={accounts}
        categories={defaultCategories}
        // editMode={!!editId}
        // initialData={initialData}
      />
    </div>
  )
}

export default AddTransactionPage
