'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered Financial Management
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Take Control of Your
          <span className="gradient-title block">Financial Future</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Smart expense tracking, intelligent budgeting, and personalized
          insights to help you achieve your financial goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="financial-primary px-8 py-3 text-lg">
              Start Managing Finances
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI Insights</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Smart Analytics</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Secured</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
