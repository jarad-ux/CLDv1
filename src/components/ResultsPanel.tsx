'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { formatCurrency } from '@/utils/format'
import type { EnrichedCalculatorResult } from '@/lib/ai'

interface ResultsPanelProps {
  result: EnrichedCalculatorResult
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const incomeCategoryLabel = {
    low: 'Low Income (≤80% AMI)',
    moderate: 'Moderate Income (81-150% AMI)',
    overLimit: 'Above Income Limit (>150% AMI)',
  }

  const incomeCategoryColor = {
    low: 'text-green-700 bg-green-50 border-green-200',
    moderate: 'text-blue-700 bg-blue-50 border-blue-200',
    overLimit: 'text-gray-700 bg-gray-50 border-gray-200',
  }

  return (
    <div className="space-y-6">
      {/* Income Category */}
      <Card className={incomeCategoryColor[result.incomeCategory]}>
        <CardHeader>
          <CardTitle className="text-lg">Income Category</CardTitle>
          <CardDescription className="text-current opacity-80">
            {incomeCategoryLabel[result.incomeCategory]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.ami && result.county && (
            <p className="text-sm">
              {result.county} AMI: {formatCurrency(result.ami)} for household of{' '}
              {result.lineItems.length > 0 ? 'your size' : 'this size'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rebate Breakdown */}
      {result.lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estimated Rebates</CardTitle>
            <CardDescription>
              Based on your selected upgrades and income category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.source === 'federal' && 'Federal HEAR Program'}
                      {item.source === 'state' && 'State Program'}
                      {item.source === 'utility' && 'Utility Program'}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t-2 border-primary">
                <p className="text-lg font-semibold">Total Rebates</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(result.totalRebate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Credit */}
      {result.federalTaxCredit > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Federal Tax Credit (25C)</CardTitle>
            <CardDescription>
              Additional savings you can claim on your tax return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(result.federalTaxCredit)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This is separate from rebates and claimed when you file taxes
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI-Generated Guidance */}
      {result.advice && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What This Means For You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.advice.homeownerSummary}</p>
            </CardContent>
          </Card>

          {result.advice.nextSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
                <CardDescription>Here&apos;s what to do next</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {result.advice.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-sm flex items-start">
                      <span className="mr-3 font-semibold text-primary">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {result.advice.contractorNotes.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">For Contractors</CardTitle>
                <CardDescription>Important project requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.advice.contractorNotes.map((note, idx) => (
                    <li key={idx} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Technical Notes */}
      {result.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.notes.map((note, idx) => (
                <li key={idx} className="text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
