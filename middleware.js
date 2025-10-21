import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
// Note: Arcjet removed from middleware to reduce Edge Function bundle size on Vercel.
// If you need Arcjet protections, consider moving them to an API route or server-side
// function to avoid bundling the Arcjet client into the Edge runtime.

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/transaction(.*)',
])

// // Create Arcjet middleware
// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   // characteristics: ["userId"], // Track based on Clerk userId
//   rules: [
//     // Shield protection for content and security
//     shield({
//       mode: 'LIVE',
//     }),
//     detectBot({
//       mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
//       allow: [
//         'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
//         'GO_HTTP', // For Inngest
//         // See the full list at https://arcjet.com/bot-list
//       ],
//     }),
//   ],
// })

// Create base Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  return NextResponse.next()
})

// Export Clerk middleware only (runs on the Edge runtime). This avoids importing
// the Arcjet client into the Edge bundle which can exceed Vercel's size limit.
export default clerk

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
