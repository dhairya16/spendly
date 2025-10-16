import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'spendly', // Unique app ID
  name: 'Spendly',
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
})
