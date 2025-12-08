'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { StateSelector } from './StateSelector'
import { IncomeForm } from './IncomeForm'
import { UpgradeSelector } from './UpgradeSelector'
import { ResultsPanel } from './ResultsPanel'
import type { CalculatorResult } from '@/lib/calculator'

interface CalculatorStepsProps {
  initialStateCode?: string
}

export function CalculatorSteps({ initialStateCode = '' }: CalculatorStepsProps) {
  const [stateCode, setStateCode] = useState(initialStateCode)
  const [zip, setZip] = useState('')
  const [income, setIncome] = useState(0)
  const [householdSize, setHouseholdSize] = useState(3)
  const [upgrades, setUpgrades] = useState({
    heatPump: false,
    waterHeater: false,
    panel: false,
    wiring: false,
  })
  const [estimatedCosts, setEstimatedCosts] = useState<Record<string, number>>({})
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgradeChange = (upgrade: keyof typeof upgrades, checked: boolean) => {
    setUpgrades((prev) => ({ ...prev, [upgrade]: checked }))
  }

  const handleCostChange = (upgrade: string, cost: number) => {
    setEstimatedCosts((prev) => ({ ...prev, [upgrade]: cost }))
  }

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stateCode,
          zip,
          income,
          householdSize,
          upgrades,
          estimatedCosts,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Calculation failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    stateCode &&
    zip.length === 5 &&
    income > 0 &&
    householdSize >= 1 &&
    Object.values(upgrades).some(Boolean)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Location</CardTitle>
            <CardDescription>Tell us where you live</CardDescription>
          </CardHeader>
          <CardContent>
            <StateSelector value={stateCode} onChange={setStateCode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Household Information</CardTitle>
            <CardDescription>We use this to determine your eligibility</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeForm
              zip={zip}
              income={income}
              householdSize={householdSize}
              onZipChange={setZip}
              onIncomeChange={setIncome}
              onHouseholdSizeChange={setHouseholdSize}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Select Upgrades</CardTitle>
            <CardDescription>Choose your home improvement projects</CardDescription>
          </CardHeader>
          <CardContent>
            <UpgradeSelector
              upgrades={upgrades}
              estimatedCosts={estimatedCosts}
              onUpgradeChange={handleUpgradeChange}
              onCostChange={handleCostChange}
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleCalculate}
          disabled={!isFormValid || loading}
          size="lg"
          className="w-full"
        >
          {loading ? 'Calculating...' : 'Calculate My Rebates'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <div>
        {result ? (
          <ResultsPanel result={result} />
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">Your results will appear here</p>
                <p className="text-sm mt-2">Fill out the form and click Calculate</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
