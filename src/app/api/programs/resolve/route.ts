import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ProgramResolverInputSchema } from '@/lib/validation'
import { lookupByZip } from '@/lib/ami'

const prisma = new PrismaClient()

/**
 * Program Resolver API
 *
 * Resolves all applicable rebate programs for a given address/household.
 * Returns federal, state, and utility programs with eligibility hints.
 *
 * POST /api/programs/resolve
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    // Validate input
    const input = ProgramResolverInputSchema.parse(body)

    const { stateCode, zip, income, householdSize, utilityIds, ownership, fuelType, upgrades } =
      input

    // Build jurisdiction filter
    const jurisdictionFilter = [
      { jurisdictionCode: 'US' }, // Federal programs
      { jurisdictionCode: stateCode.toUpperCase() }, // State programs
    ]

    // Add utility-specific jurisdictions if provided
    if (utilityIds && utilityIds.length > 0) {
      jurisdictionFilter.push(...utilityIds.map((id) => ({ jurisdictionCode: id })))
    }

    // Query active programs
    const programs = await prisma.program.findMany({
      where: {
        status: 'active',
        OR: jurisdictionFilter,
      },
      include: {
        benefits: true,
        eligibilityRules: true,
        sources: true,
      },
      orderBy: [
        { jurisdictionType: 'asc' }, // federal first, then state, then utility
        { name: 'asc' },
      ],
    })

    // Calculate AMI percentage if income provided
    let amiPercent: number | null = null
    if (income && householdSize) {
      const amiData = lookupByZip(zip, householdSize)
      if (amiData?.ami) {
        amiPercent = income / amiData.ami
      }
    }

    // Generate response with eligibility summaries
    const response = programs.map((program) => {
      const eligibilitySummary: string[] = []

      // Generate human-readable eligibility hints
      for (const rule of program.eligibilityRules) {
        const def = rule.definition as Record<string, any>

        if (rule.ruleType === 'income' && amiPercent !== null) {
          // Income eligibility check
          const tiers = def.tiers || {}

          if (tiers.low && amiPercent <= (tiers.low.maxPercentAMI || 0.8)) {
            eligibilitySummary.push(
              `✓ Household appears income-qualified as low-income (≤80% AMI) - ${
                tiers.low.coverage ? Math.round(tiers.low.coverage * 100) + '% coverage' : 'full coverage'
              }`
            )
          } else if (
            tiers.moderate &&
            amiPercent > (tiers.moderate.minPercentAMI || 0.8) &&
            amiPercent <= (tiers.moderate.maxPercentAMI || 1.5)
          ) {
            eligibilitySummary.push(
              `✓ Household appears income-qualified as moderate-income (80-150% AMI) - ${
                tiers.moderate.coverage ? Math.round(tiers.moderate.coverage * 100) + '% coverage' : 'partial coverage'
              }`
            )
          } else if (amiPercent > 1.5) {
            eligibilitySummary.push(
              '⚠ Household income may exceed program limits (>150% AMI) - verify eligibility'
            )
          }

          if (def.note) {
            eligibilitySummary.push(`ℹ ${def.note}`)
          }
        } else if (rule.ruleType === 'income' && !income) {
          eligibilitySummary.push(
            'ℹ Income verification required - eligibility depends on Area Median Income (AMI)'
          )
        }

        if (rule.ruleType === 'territory') {
          if (def.stateCode) {
            eligibilitySummary.push(`✓ Available in ${def.stateCode}`)
          } else if (def.scope === 'national') {
            eligibilitySummary.push('✓ Available nationwide')
          } else if (def.utilityTerritory) {
            eligibilitySummary.push(`Utility territory: ${def.utilityTerritory}`)
          }

          if (def.note) {
            eligibilitySummary.push(`ℹ ${def.note}`)
          }
        }

        if (rule.ruleType === 'fuel') {
          if (fuelType && def.requiredFuel && fuelType === def.requiredFuel) {
            eligibilitySummary.push(`✓ Fuel type matches (${fuelType})`)
          } else if (def.note) {
            eligibilitySummary.push(`ℹ ${def.note}`)
          }
        }

        if (rule.ruleType === 'building-type') {
          if (def.allowedTypes) {
            eligibilitySummary.push(
              `Building types: ${(def.allowedTypes as string[]).join(', ')}`
            )
          }
          if (def.note) {
            eligibilitySummary.push(`ℹ ${def.note}`)
          }
        }

        if (rule.ruleType === 'equipment-spec') {
          if (def.requirements) {
            eligibilitySummary.push(`Equipment: ${def.requirements}`)
          }
          if (def.note) {
            eligibilitySummary.push(`ℹ ${def.note}`)
          }
        }
      }

      // If no eligibility summary generated, add generic message
      if (eligibilitySummary.length === 0) {
        eligibilitySummary.push('Eligibility criteria apply - verify with program administrator')
      }

      return {
        id: program.id,
        slug: program.slug,
        name: program.name,
        jurisdictionType: program.jurisdictionType,
        jurisdictionCode: program.jurisdictionCode,
        programType: program.programType,
        status: program.status,
        summaryShort: program.summaryShort,
        urlOfficial: program.urlOfficial,
        benefits: program.benefits.map((b) => ({
          measure: b.measure,
          structure: b.structure,
          amountMax: b.amountMax,
          percent: b.percent,
          householdCap: b.householdCap,
          notes: b.notes,
        })),
        eligibilitySummary,
      }
    })

    return NextResponse.json({ programs: response })
  } catch (error) {
    console.error('Program resolver error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to resolve programs', details: String(error) },
      { status: 500 }
    )
  }
}
