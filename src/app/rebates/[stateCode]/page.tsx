import { notFound } from 'next/navigation'
import { getStateMetadata } from '@/lib/states'
import { generateStateContent } from '@/lib/ai'
import { CalculatorSteps } from '@/components/CalculatorSteps'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface StatePageProps {
  params: {
    stateCode: string
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const stateCode = params.stateCode.toLowerCase()
  const metadata = getStateMetadata(stateCode)

  if (!metadata) {
    notFound()
  }

  // Generate dynamic content (template-based until MCP is wired)
  const content = await generateStateContent(stateCode)

  const statusColor = {
    active: 'text-green-700 bg-green-50 border-green-200',
    pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    'not-available': 'text-gray-700 bg-gray-50 border-gray-200',
  }

  const statusLabel = {
    active: 'Active Program',
    pending: 'Program Pending',
    'not-available': 'Not Yet Available',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* State Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {content.heroTitle}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColor[metadata.status]
              }`}
            >
              {statusLabel[metadata.status]}
            </span>
          </div>

          {content.heroSubtitle && (
            <p className="text-lg text-muted-foreground">{content.heroSubtitle}</p>
          )}
        </div>

        {/* Program Description */}
        {content.description && (
          <Card>
            <CardContent className="pt-6">
              <p className="leading-relaxed">{content.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Status-specific messaging */}
        {metadata.status === 'pending' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                The state program for {metadata.name} is currently pending approval. You may
                still qualify for federal HEAR rebates and the 25C tax credit. Use the
                calculator below to see what&apos;s available now.
              </p>
            </CardContent>
          </Card>
        )}

        {metadata.status === 'not-available' && (
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-800">
                {metadata.name} does not currently have a state-run HEAR program. However,
                you may still qualify for federal rebates and tax credits. Check the
                calculator below for available incentives.
              </p>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        {content.faq && content.faq.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about {metadata.name} rebates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {content.faq.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {content.additionalNotes && content.additionalNotes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.additionalNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Calculator */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Check Your Eligibility</h2>
          <CalculatorSteps initialStateCode={stateCode} />
        </div>
      </div>
    </div>
  )
}

// Generate static params for known states
export async function generateStaticParams() {
  const { getAllStates } = await import('@/lib/states')
  const states = getAllStates()

  return states.map((state) => ({
    stateCode: state.code.toLowerCase(),
  }))
}
