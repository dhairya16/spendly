'use client'

import { bulkDeleteTransactions } from '@/actions/account'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import useFetch from '@/hooks/use-fetch'
import { formatCurrency } from '@/lib/currency'
import { format } from 'date-fns'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const RECURRING_INTERVALS = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
}

const TransactionTable = ({ transactions }) => {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'desc',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [recurringFilter, setRecurringFilter] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  // Memoized filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.category?.toLowerCase().includes(searchLower)
      )
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter)
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === 'recurring') return transaction.isRecurring
        return !transaction.isRecurring
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date)
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        default:
          comparison = 0
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return result
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig])

  const recordsPerPage = 10
  const numPages = Math.ceil(filteredTransactions.length / recordsPerPage)

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

  const paginatedTransactions = filteredTransactions.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    )
  }

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions)

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return

    deleteFn(selectedIds)
  }

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error('Transactions deleted successfully')
    }
  }, [deleted, deleteLoading])

  const handleClearFilters = () => {
    setSearchTerm('')
    setTypeFilter('')
    setRecurringFilter('')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {deleteLoading && (
        <div className="financial-card p-4">
          <BarLoader className="mt-4" width={'100%'} color="var(--primary)" />
        </div>
      )}

      {/* Filters Section */}
      <div className="financial-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              className="pl-10 financial-card"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="financial-card w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={recurringFilter}
              onValueChange={(value) => {
                setRecurringFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="financial-card w-[160px]">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">
                  Non-recurring Only
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                // size="sm"
                onClick={handleBulkDelete}
                className="financial-card"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            )}

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear filters"
                className="financial-card"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="financial-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortConfig.field === 'date' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center">Description</div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig.field === 'category' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Amount
                  {sortConfig.field === 'amount' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        No transactions found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {transaction.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold text-lg ${
                        transaction.type === 'EXPENSE'
                          ? 'expense-negative'
                          : 'income-positive'
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  'PPP'
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination UI */}
        <div className="flex justify-end my-3">
          <Pagination className="w-auto">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {/* Show limited page numbers on mobile */}
              {numPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: numPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )
              ) : (
                // Show smart pagination for more than 5 pages
                <>
                  {/* Always show first page */}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(1)}
                      isActive={currentPage === 1}
                      className="w-8 h-8 p-0 flex items-center justify-center"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {/* Show ellipsis if current page is far from start */}
                  {currentPage > 3 && <PaginationEllipsis />}

                  {/* Show current page and neighbors */}
                  {currentPage > 1 && currentPage < numPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(currentPage)}
                        isActive={true}
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show ellipsis if current page is far from end */}
                  {currentPage < numPages - 2 && <PaginationEllipsis />}

                  {/* Always show last page if not already shown */}
                  {currentPage !== numPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(numPages)}
                        isActive={currentPage === numPages}
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {numPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === numPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default TransactionTable
