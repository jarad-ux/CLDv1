import { NextRequest, NextResponse } from 'next/server'
import { LeadSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { sendLeadToPipelines } from '@/lib/ai'
import { logger } from '@/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = LeadSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn('Invalid lead input', validationResult.error)
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const leadData = validationResult.data

    // Check consent
    if (!leadData.consent) {
      return NextResponse.json(
        { error: 'Consent is required to submit lead' },
        { status: 400 }
      )
    }

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        fullName: leadData.fullName,
        email: leadData.email,
        phone: leadData.phone,
        address: leadData.address,
        zip: leadData.zip,
        utility: leadData.utility,
        ownership: leadData.ownership,
        fuelType: leadData.fuelType,
        consent: leadData.consent,
        stateCode: leadData.stateCode,
        income: leadData.income,
        householdSize: leadData.householdSize,
        upgrades: leadData.upgrades,
        result: leadData.result,
      },
    })

    logger.info('Lead created', { leadId: lead.id, stateCode: lead.stateCode })

    // Send to automation pipelines (MCP hook)
    const pipelineResult = await sendLeadToPipelines({
      ...leadData,
      id: lead.id,
    })

    if (!pipelineResult.ok) {
      logger.warn('Lead pipeline errors', pipelineResult.errors)
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Your information has been submitted successfully',
    })
  } catch (error) {
    logger.error('Lead API error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
