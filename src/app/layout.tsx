import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HVAC Rebate Navigator - Find HEAR & HOMES Rebates',
  description:
    'Calculate your federal and state HVAC rebates. Find out how much you can save on heat pumps, water heaters, and electrical upgrades.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">HVAC Rebate Navigator</h1>
              <p className="text-sm text-muted-foreground">
                Federal HEAR & HOMES Rebates Calculator
              </p>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              <p>
                Information provided is for estimation purposes only. Actual rebates may vary.
                Consult with a qualified contractor for accurate quotes.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
