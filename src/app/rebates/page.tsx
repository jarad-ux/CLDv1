import { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { CalculatorSteps } from '@/components/CalculatorSteps'

export const metadata: Metadata = {
  title: 'National Rebate Registry | CLDv1',
  description:
    'Track HEAR/HOMES rebate programs across all 50 states. See program status, coverage, and start your rebate calculation.',
}

type StateApiResponse = {
  totalPrograms: number
  totalStates: number
  statusCounts: {
    launched: number
    approved: number
    planned: number
    pending: number
    none: number
  }
  states: Array<{
    stateCode: string
    stateName: string
    hearStatus: string
    homesStatus: string
    notes?: string
    programCount: number
  }>
}

// Helper for badge styling
function statusColor(status: string): string {
  switch (status) {
    case 'launched':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'approved':
      return 'bg-sky-100 text-sky-800 border-sky-200'
    case 'planned':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'pending':
      return 'bg-slate-100 text-slate-800 border-slate-200'
    case 'none':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

export default async function RebatesPage() {
  let data: StateApiResponse | null = null
  let error = false

  try {
    const res = await fetch('http://localhost:3000/api/states', {
      cache: 'no-store',
    })

    if (res.ok) {
      data = await res.json()
    } else {
      error = true
    }
  } catch (err) {
    console.error('Failed to fetch states data:', err)
    error = true
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* National Registry Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              National Rebate Registry
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              CLDv1 tracks federal, state, and utility rebate programs across all 50 states. This
              index shows HEAR/HOMES status by state and how many programs are currently modeled in
              the catalog.
            </p>
          </div>

          {error && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-800">
                  We couldn&apos;t load the national registry index right now. The calculator below
                  still works.
                </p>
              </CardContent>
            </Card>
          )}

          {data && (
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <CardTitle>State HEAR/HOMES Status</CardTitle>
                  <CardDescription>
                    {data.totalPrograms} programs currently modeled across {data.totalStates}{' '}
                    states
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">
                      launched ({data.statusCounts.launched})
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-muted-foreground">
                      approved ({data.statusCounts.approved})
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">
                      planned ({data.statusCounts.planned})
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-muted-foreground">
                      pending ({data.statusCounts.pending})
                    </span>
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="py-2 pr-4 text-left font-medium">State</th>
                        <th className="py-2 px-4 text-left font-medium">HEAR</th>
                        <th className="py-2 px-4 text-left font-medium">HOMES</th>
                        <th className="py-2 px-4 text-left font-medium">Programs</th>
                        <th className="py-2 pl-4 text-left font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.states
                        .slice()
                        .sort((a, b) => a.stateName.localeCompare(b.stateName))
                        .map((state) => (
                          <tr
                            key={state.stateCode}
                            className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-2.5 pr-4 align-top">
                              <div className="font-medium">
                                {state.stateName}{' '}
                                <span className="text-xs font-normal text-muted-foreground">
                                  ({state.stateCode})
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 align-top">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(
                                  state.hearStatus
                                )}`}
                              >
                                {state.hearStatus}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 align-top">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(
                                  state.homesStatus
                                )}`}
                              >
                                {state.homesStatus}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 align-top">
                              <span className="font-semibold tabular-nums">
                                {state.programCount}
                              </span>
                            </td>
                            <td className="py-2.5 pl-4 align-top text-xs text-muted-foreground">
                              {state.notes ?? '—'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Calculator Section */}
        <div className="border-t pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Calculate Your Rebates</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Enter your information below to see how much you can save with federal HEAR/HOMES
              rebates and state incentives.
            </p>
          </div>

          <CalculatorSteps />
        </div>
      </div>
    </div>
  )
}
