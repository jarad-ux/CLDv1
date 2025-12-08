'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { formatCurrency } from '@/utils/format'
import type { EnrichedCalculatorResult } from '@/lib/ai'

interface ResultsPanelProps {
  result: EnrichedCalculatorResult
  programs?: any[]
}

export function ResultsPanel({ result, programs = [] }: ResultsPanelProps) {
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

      {/* Program Catalog - Programs that apply to this project */}
      {programs && programs.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Programs That May Apply to This Project</CardTitle>
            <CardDescription>
              Based on our national rebate registry - {programs.length}{' '}
              {programs.length === 1 ? 'program' : 'programs'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {programs.map((program) => (
                <div key={program.id} className="border-l-4 border-primary/30 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">{program.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {program.jurisdictionType === 'federal' && '🇺🇸 Federal Program'}
                        {program.jurisdictionType === 'state' && `📍 State Program (${program.jurisdictionCode})`}
                        {program.jurisdictionType === 'utility' && `⚡ Utility Program`}
                        {program.jurisdictionType === 'local' && `🏘️ Local Program`}
                        {' • '}
                        {program.programType === 'rebate' && 'Rebate'}
                        {program.programType === 'tax-credit' && 'Tax Credit'}
                        {program.programType === 'performance' && 'Performance-Based'}
                        {program.programType === 'loan' && 'Loan Program'}
                      </p>
                    </div>
                  </div>

                  {program.summaryShort && (
                    <p className="text-sm text-muted-foreground mb-3">{program.summaryShort}</p>
                  )}

                  {program.benefits && program.benefits.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Available Benefits
                      </p>
                      <div className="space-y-1">
                        {program.benefits.map((benefit: any, idx: number) => (
                          <div key={idx} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>
                              <span className="capitalize">
                                {benefit.measure.replace(/-/g, ' ')}
                              </span>
                              {': '}
                              {benefit.structure === 'fixed' &&
                                benefit.amountMax &&
                                `Up to ${formatCurrency(benefit.amountMax)}`}
                              {benefit.structure === 'percent-of-cost' &&
                                benefit.percent &&
                                `${Math.round(benefit.percent * 100)}% of cost`}
                              {benefit.structure === 'performance' && 'Based on energy savings'}
                              {benefit.amountMax &&
                                benefit.structure === 'percent-of-cost' &&
                                ` (max ${formatCurrency(benefit.amountMax)})`}
                              {benefit.notes && (
                                <span className="text-xs text-muted-foreground block ml-0 mt-0.5">
                                  {benefit.notes}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.eligibilitySummary && program.eligibilitySummary.length > 0 && (
                    <div className="bg-muted/30 rounded p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Eligibility
                      </p>
                      <div className="space-y-1">
                        {program.eligibilitySummary.map((item: string, idx: number) => (
                          <p key={idx} className="text-xs leading-relaxed">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {program.urlOfficial && (
                    <div className="mt-3">
                      <a
                        href={program.urlOfficial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View official program details →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
