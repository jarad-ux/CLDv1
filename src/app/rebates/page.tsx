import { CalculatorSteps } from '@/components/CalculatorSteps'

export default function RebatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Rebate Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your federal HEAR/HOMES rebates and state incentives. Enter your
            information below to see how much you can save.
          </p>
        </div>

        <CalculatorSteps />
      </div>
    </div>
  )
}
