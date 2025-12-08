import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Save Thousands on Energy-Efficient Home Upgrades
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find out how much you can save with federal HEAR & HOMES rebates and state
            incentives for heat pumps, water heaters, and electrical upgrades.
          </p>
          <div className="pt-4">
            <Link href="/rebates">
              <Button size="lg">Check Your Rebates</Button>
            </Link>
          </div>
        </div>

        {/* Program Overview */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card>
            <CardHeader>
              <CardTitle>HEAR Rebates</CardTitle>
              <CardDescription>Home Efficiency Rebates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Get up to $14,000 in rebates for qualifying energy-efficient home
                improvements including heat pumps, water heaters, and electrical upgrades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HOMES Program</CardTitle>
              <CardDescription>Whole-Home Energy Savings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Earn rebates based on your home&apos;s energy savings. The more you save, the
                more you earn - up to $8,000 for qualifying improvements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Credits</CardTitle>
              <CardDescription>Federal 25C Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Claim up to $3,200 annually in federal tax credits on top of rebates for
                qualified equipment and installation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Enter Your Information</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your location, household income, and planned upgrades
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">See Your Rebates</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant estimates for federal, state, and utility rebates you qualify for
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Connect with Contractors</h3>
                <p className="text-sm text-muted-foreground">
                  Get matched with qualified contractors who can help you claim your rebates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <Link href="/rebates">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
