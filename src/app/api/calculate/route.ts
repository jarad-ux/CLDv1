import { NextRequest, NextResponse } from 'next/server'
import { CalculatorInputSchema } from '@/lib/validation'
import { calculateRebates } from '@/lib/calculator'
import { enrichWithGuidance } from '@/lib/ai'
import { logger } from '@/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = CalculatorInputSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn('Invalid calculator input', validationResult.error)
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const input = validationResult.data

    // Calculate rebates
    const result = await calculateRebates(input)

    // Enrich with AI guidance (MCP hook - currently a passthrough)
    const enrichedResult = await enrichWithGuidance(result)

    logger.info('Calculator results generated', {
      stateCode: input.stateCode,
      zip: input.zip,
      incomeCategory: result.incomeCategory,
      totalRebate: result.totalRebate,
    })

    return NextResponse.json(enrichedResult)
  } catch (error) {
    logger.error('Calculate API error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
