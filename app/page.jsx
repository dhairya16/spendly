import HeroSection from '@/components/hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Key Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Smart Financial Management
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track expenses, manage budgets, and gain insights with our
              intuitive financial platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="financial-card p-6 text-center">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground text-sm">
                  Simple, intuitive interface that makes financial management
                  effortless
                </p>
              </CardContent>
            </Card>

            <Card className="financial-card p-6 text-center">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get personalized recommendations and spending analysis powered
                  by AI
                </p>
              </CardContent>
            </Card>

            <Card className="financial-card p-6 text-center">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">
                  Secured with end-to-end encryption for your financial data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to take control of your finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up securely and connect your accounts in just a few clicks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Expenses</h3>
              <p className="text-muted-foreground">
                Automatically categorize and track your spending with smart
                insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimize Budget</h3>
              <p className="text-muted-foreground">
                Set budgets and get recommendations to improve your financial
                health
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter and achieving their financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="financial-primary px-8 py-3">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
