export function formatCurrency(value) {
  // Handle Prisma Decimal-like objects and other numeric inputs
  let num = value
  if (num == null) return '₹0.00'
  if (typeof num === 'object' && typeof num.toNumber === 'function') {
    num = num.toNumber()
  }
  num = Number(num)
  if (Number.isNaN(num)) return '₹0.00'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num)
}
