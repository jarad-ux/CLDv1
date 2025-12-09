import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStateProgramStatus, STATE_PROGRAMS } from '@/data/statePrograms'
import { CalculatorSteps } from '@/components/CalculatorSteps'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface StatePageProps {
  params: {
    stateCode: string
  }
}

// Helper for badge styling (matches /rebates dashboard)
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

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const code = params.stateCode.toUpperCase()
  const state = getStateProgramStatus(code)

  if (!state) {
    return {
      title: 'State Not Found | CLDv1',
    }
  }

  return {
    title: `${state.stateName} HEAR/HOMES Rebates | CLDv1`,
    description: `Track ${state.stateName} rebate programs. HEAR status: ${state.hearStatus}. HOMES status: ${state.homesStatus}. Calculate your eligibility for federal and state incentives.`,
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const code = params.stateCode.toUpperCase()
  const state = getStateProgramStatus(code)

  if (!state) {
    notFound()
  }

  const { stateName, hearStatus, homesStatus, notes } = state

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* State Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {stateName} Rebate Programs
            </h1>
            <p className="text-lg text-muted-foreground">
              Part of the CLDv1 National Rebate Registry. Check program status and calculate
              your eligibility for federal HEAR/HOMES rebates.
            </p>
          </div>

          {/* HEAR/HOMES Status Badges */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                HEAR Program
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusColor(
                  hearStatus
                )}`}
              >
                {hearStatus}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                HOMES Program
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusColor(
                  homesStatus
                )}`}
              >
                {homesStatus}
              </span>
            </div>
          </div>
        </div>

        {/* State Notes */}
        {notes && (
          <Card>
            <CardHeader>
              <CardTitle>Program Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-sm">{notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Status-specific messaging */}
        {(hearStatus === 'launched' || homesStatus === 'launched') && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-800">
                <strong>Active rebate program</strong> – {stateName} has launched rebate
                programs. Use the calculator below to see what you qualify for. Federal
                incentives may also be available.
              </p>
            </CardContent>
          </Card>
        )}

        {hearStatus === 'approved' && homesStatus === 'approved' && (
          <Card className="border-sky-200 bg-sky-50">
            <CardContent className="pt-6">
              <p className="text-sm text-sky-800">
                <strong>Approved for launch</strong> – {stateName}&apos;s programs are approved
                and preparing to launch. Check back for updates, and use the calculator to
                estimate your future eligibility.
              </p>
            </CardContent>
          </Card>
        )}

        {(hearStatus === 'planned' || homesStatus === 'planned') && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>In planning</strong> – {stateName} is designing rebate programs. You may
                still qualify for federal HEAR rebates and the 25C tax credit. Use the calculator
                below to see what&apos;s available now.
              </p>
            </CardContent>
          </Card>
        )}

        {hearStatus === 'pending' && homesStatus === 'pending' && (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-800">
                <strong>Application pending</strong> – {stateName}&apos;s rebate programs are
                pending federal approval. However, you may still qualify for federal rebates and
                tax credits. Check the calculator below for available incentives.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Calculator Section */}
        <div className="border-t pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Calculate Your Rebates</h2>
            <p className="text-base text-muted-foreground">
              Enter your information to see how much you can save with federal HEAR/HOMES rebates,
              state programs, and utility incentives in {stateName}.
            </p>
          </div>

          <CalculatorSteps initialStateCode={params.stateCode.toLowerCase()} />
        </div>
      </div>
    </div>
  )
}

// Generate static params for all states in the registry
export async function generateStaticParams() {
  return STATE_PROGRAMS.map((state) => ({
    stateCode: state.stateCode.toLowerCase(),
  }))
}
