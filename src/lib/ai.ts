import type { CalculatorResult } from './calculator'
import { getStateMetadata } from './states'
import { logger } from '@/utils/logger'
import { formatCurrency } from '@/utils/format'

// ============================================================================
// Type Definitions
// ============================================================================

export interface EnrichedCalculatorResult extends CalculatorResult {
  advice: {
    homeownerSummary: string
    contractorNotes: string[]
    nextSteps: string[]
  }
}

export interface StateContent {
  heroTitle: string
  heroSubtitle: string
  description: string
  faq: Array<{ question: string; answer: string }>
  additionalNotes: string[]
}

// ============================================================================
// MCP HOOK 1: Enrich Calculator Results with AI Guidance
// ============================================================================

/**
 * Enriches calculator results with AI-generated guidance for homeowners and contractors.
 *
 * CURRENT BEHAVIOR (Template-based):
 * - Generates deterministic guidance based on CalculatorResult fields
 * - Works without MCP server (production-ready fallback)
 * - Provides personalized messaging based on income category and selected upgrades
 *
 * TODO (MCP Integration):
 * When MCP server is available, replace the template logic with:
 *
 * ```typescript
 * const mcpResponse = await mcpClient.callTool('generate_rebate_guidance', {
 *   result,
 *   context: {
 *     stateCode: result.stateCode, // Add to CalculatorResult if needed
 *     county: result.county,
 *     selectedUpgrades: result.lineItems.map(item => item.name)
 *   }
 * })
 *
 * return {
 *   ...result,
 *   advice: {
 *     homeownerSummary: mcpResponse.homeownerGuidance,
 *     contractorNotes: mcpResponse.contractorTips,
 *     nextSteps: mcpResponse.actionItems
 *   }
 * }
 * ```
 *
 * Expected MCP tool schema:
 * - Tool: "generate_rebate_guidance"
 * - Input: { result: CalculatorResult, context: { stateCode, county, selectedUpgrades } }
 * - Output: { homeownerGuidance: string, contractorTips: string[], actionItems: string[] }
 */
export async function enrichWithGuidance(
  result: CalculatorResult
): Promise<EnrichedCalculatorResult> {
  logger.debug('enrichWithGuidance called', {
    incomeCategory: result.incomeCategory,
    totalRebate: result.totalRebate,
    upgradeCount: result.lineItems.length,
  })

  // Template-based guidance (deterministic fallback)
  const advice = generateTemplateGuidance(result)

  return {
    ...result,
    advice,
  }
}

/**
 * Generate template-based guidance (fallback when MCP not available)
 */
function generateTemplateGuidance(result: CalculatorResult): EnrichedCalculatorResult['advice'] {
  const { incomeCategory, totalRebate, federalTaxCredit, lineItems, ami, county } = result

  // Build homeowner summary
  let homeownerSummary = ''

  if (incomeCategory === 'low') {
    homeownerSummary = `Great news! Based on your household income, you qualify for the maximum rebate coverage through the federal HEAR program. You're eligible for up to ${formatCurrency(totalRebate)} in rebates, which covers 100% of qualifying costs up to program caps.`
  } else if (incomeCategory === 'moderate') {
    homeownerSummary = `You qualify for the HEAR program with 50% cost coverage. Based on your selected upgrades, you're eligible for approximately ${formatCurrency(totalRebate)} in rebates.`
  } else {
    homeownerSummary = `While your income exceeds the HEAR program limits (150% of Area Median Income), you may still qualify for federal tax credits worth up to ${formatCurrency(federalTaxCredit)} when you file your taxes.`
  }

  if (federalTaxCredit > 0 && incomeCategory !== 'overLimit') {
    homeownerSummary += ` Additionally, you can claim up to ${formatCurrency(federalTaxCredit)} in federal tax credits (separate from rebates).`
  }

  if (county && ami) {
    homeownerSummary += ` Your eligibility is based on ${county} Area Median Income of ${formatCurrency(ami)} for your household size.`
  }

  // Build contractor notes
  const contractorNotes: string[] = []

  if (lineItems.length > 0) {
    const hasHeatPump = lineItems.some(item => item.id.includes('heat-pump'))
    const hasPanel = lineItems.some(item => item.id.includes('panel'))
    const hasWiring = lineItems.some(item => item.id.includes('wiring'))

    if (hasHeatPump) {
      contractorNotes.push(
        'Heat pump installation should be performed by a certified HVAC contractor participating in the HEAR program'
      )
    }

    if (hasPanel || hasWiring) {
      contractorNotes.push(
        'Electrical work must be performed by a licensed electrician and meet all local code requirements'
      )
    }

    if (incomeCategory === 'low') {
      contractorNotes.push(
        'Customer qualifies for 100% upfront rebate - ensure all documentation is submitted before project start'
      )
    }

    contractorNotes.push(
      'All equipment must meet ENERGY STAR or equivalent efficiency standards to qualify for rebates'
    )
  }

  // Build next steps
  const nextSteps: string[] = []

  if (incomeCategory === 'low' || incomeCategory === 'moderate') {
    nextSteps.push('Gather income documentation (tax returns, pay stubs, or benefit statements)')
    nextSteps.push('Find a participating contractor in your area')
    nextSteps.push('Get quotes and ensure equipment meets ENERGY STAR requirements')
    nextSteps.push('Submit rebate application before starting work')
  } else {
    nextSteps.push('Consult with a tax professional about claiming 25C tax credits')
    nextSteps.push('Get quotes from licensed contractors')
    nextSteps.push('Check for additional utility or local incentives in your area')
  }

  if (result.notes.some(note => note.includes('AMI data not available'))) {
    nextSteps.push('Contact your state energy office to confirm AMI data for your area')
  }

  return {
    homeownerSummary,
    contractorNotes,
    nextSteps,
  }
}

// ============================================================================
// MCP HOOK 2: Send Lead to Automation Pipelines
// ============================================================================

/**
 * Sends lead data to downstream automation systems (Twilio, Retell, CRM).
 *
 * CURRENT BEHAVIOR (Logging only):
 * - Logs lead information for debugging
 * - Returns success without external calls
 * - Safe for production (no-op behavior)
 *
 * TODO (MCP Integration):
 * When MCP server is configured with Twilio/Retell/CRM tools:
 *
 * ```typescript
 * const results = await Promise.allSettled([
 *   // 1. Twilio - Create outbound call task
 *   mcpClient.callTool('twilio_create_call', {
 *     to: lead.phone,
 *     from: process.env.TWILIO_PHONE_NUMBER,
 *     metadata: {
 *       leadId: lead.id,
 *       stateCode: lead.stateCode,
 *       totalRebate: lead.result?.totalRebate
 *     }
 *   }),
 *
 *   // 2. Retell AI - Start conversation workflow
 *   mcpClient.callTool('retell_start_conversation', {
 *     leadId: lead.id,
 *     phone: lead.phone,
 *     workflowType: 'rebate_qualification',
 *     context: {
 *       incomeCategory: lead.result?.incomeCategory,
 *       estimatedRebates: lead.result?.totalRebate
 *     }
 *   }),
 *
 *   // 3. CRM - Upsert lead record
 *   mcpClient.callTool('crm_upsert_lead', {
 *     email: lead.email,
 *     phone: lead.phone,
 *     fields: {
 *       fullName: lead.fullName,
 *       state: lead.stateCode,
 *       zip: lead.zip,
 *       utility: lead.utility,
 *       ownership: lead.ownership,
 *       fuelType: lead.fuelType,
 *       estimatedRebates: lead.result?.totalRebate,
 *       incomeCategory: lead.result?.incomeCategory,
 *       upgrades: JSON.stringify(lead.upgrades)
 *     },
 *     tags: ['hear-rebate', `state-${lead.stateCode}`, `income-${lead.result?.incomeCategory}`]
 *   }),
 *
 *   // 4. Email - Send confirmation
 *   mcpClient.callTool('send_email', {
 *     to: lead.email,
 *     template: 'rebate_confirmation',
 *     data: {
 *       fullName: lead.fullName,
 *       totalRebate: lead.result?.totalRebate,
 *       nextSteps: lead.result?.advice?.nextSteps || []
 *     }
 *   })
 * ])
 *
 * const errors = results
 *   .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
 *   .map(r => r.reason.message)
 *
 * return {
 *   ok: errors.length === 0,
 *   errors: errors.length > 0 ? errors : undefined
 * }
 * ```
 *
 * Expected MCP tools:
 * - "twilio_create_call" - Queue outbound call
 * - "retell_start_conversation" - Trigger AI voice workflow
 * - "crm_upsert_lead" - Create/update CRM record
 * - "send_email" - Send transactional email
 *
 * Environment variables needed:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 * - RETELL_API_KEY
 * - RETELL_WORKSPACE_ID
 * - CRM_API_KEY (Salesforce/HubSpot/etc.)
 */
export async function sendLeadToPipelines(lead: any): Promise<{
  ok: boolean
  errors?: string[]
}> {
  logger.info('Lead captured', {
    leadId: lead.id,
    email: lead.email,
    phone: lead.phone,
    stateCode: lead.stateCode,
    consent: lead.consent,
    totalRebate: lead.result?.totalRebate,
    incomeCategory: lead.result?.incomeCategory,
  })

  // Log structured lead data for pipeline debugging
  logger.debug('Lead pipeline data', {
    contact: {
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      zip: lead.zip,
    },
    property: {
      ownership: lead.ownership,
      fuelType: lead.fuelType,
      utility: lead.utility,
    },
    rebateEstimate: {
      incomeCategory: lead.result?.incomeCategory,
      totalRebate: lead.result?.totalRebate,
      federalTaxCredit: lead.result?.federalTaxCredit,
      upgrades: lead.upgrades,
    },
    consent: {
      marketing: lead.consent,
      timestamp: new Date().toISOString(),
    },
  })

  // TODO: When MCP is configured, replace this with actual pipeline calls
  // See detailed implementation guide in function comments above

  return { ok: true }
}

// ============================================================================
// MCP HOOK 3: Generate Dynamic State-Specific Content
// ============================================================================

/**
 * Generates rich, state-specific content for landing pages.
 *
 * CURRENT BEHAVIOR (Template-based):
 * - Uses state metadata from states.json to generate content
 * - Creates FAQs based on program status and features
 * - Works without MCP (production-ready fallback)
 *
 * TODO (MCP Integration):
 * When MCP server is available, enhance with AI-generated content:
 *
 * ```typescript
 * const stateMetadata = getStateMetadata(stateCode)
 * if (!stateMetadata) return getDefaultStateContent(stateCode)
 *
 * const mcpResponse = await mcpClient.callTool('generate_state_content', {
 *   stateCode,
 *   metadata: stateMetadata,
 *   context: {
 *     programStatus: stateMetadata.status,
 *     hasStateProgram: stateMetadata.hasHearProgram,
 *     existingNotes: stateMetadata.notes
 *   }
 * })
 *
 * return {
 *   heroTitle: mcpResponse.heroTitle,
 *   heroSubtitle: mcpResponse.heroSubtitle,
 *   description: mcpResponse.longDescription,
 *   faq: mcpResponse.faqs,
 *   additionalNotes: mcpResponse.importantNotes
 * }
 * ```
 *
 * Expected MCP tool schema:
 * - Tool: "generate_state_content"
 * - Input: { stateCode, metadata, context }
 * - Output: { heroTitle, heroSubtitle, longDescription, faqs, importantNotes }
 */
export async function generateStateContent(stateCode: string): Promise<StateContent> {
  logger.debug('generateStateContent called', { stateCode })

  const metadata = getStateMetadata(stateCode)

  if (!metadata) {
    return getDefaultStateContent(stateCode)
  }

  // Template-based content generation
  return generateTemplateStateContent(stateCode, metadata)
}

/**
 * Generate template-based state content (fallback when MCP not available)
 */
function generateTemplateStateContent(
  stateCode: string,
  metadata: any // StateMetadata type
): StateContent {
  const stateName = metadata.name
  const isActive = metadata.status === 'active'
  const isPending = metadata.status === 'pending'
  const hasProgram = metadata.hasHearProgram

  // Hero section
  const heroTitle = metadata.programName || `${stateName} Energy Rebates`
  const heroSubtitle =
    metadata.tagline ||
    (isActive
      ? 'Find out how much you can save on energy-efficient home upgrades'
      : 'Federal rebates available now')

  // Description
  let description = ''
  if (isActive && hasProgram) {
    description = `${stateName} residents can access both federal HEAR/HOMES rebates and state-specific incentives for qualifying home energy improvements. The program provides point-of-sale rebates for heat pumps, water heaters, and electrical upgrades, making energy efficiency more affordable for homeowners across the state.`
  } else if (isPending) {
    description = `While ${stateName}'s state-run HEAR program is pending approval, residents can still qualify for federal rebates and tax credits. Check your eligibility using the calculator below, and we'll notify you when additional state incentives become available.`
  } else {
    description = `${stateName} residents can access federal HEAR/HOMES rebates and tax credits for qualifying home energy improvements. Use the calculator below to estimate your rebates based on your household income and planned upgrades.`
  }

  // FAQs
  const faq: Array<{ question: string; answer: string }> = []

  faq.push({
    question: 'What rebates are available in ' + stateName + '?',
    answer: isActive
      ? `${stateName} offers both federal HEAR rebates and ${hasProgram ? 'enhanced state incentives' : 'federal tax credits'}. The federal program provides up to $14,000 in rebates for income-qualified households, while tax credits can add up to $3,200 more in savings.`
      : `${stateName} residents can access federal HEAR rebates (up to $14,000) and federal 25C tax credits (up to $3,200). ${isPending ? 'Additional state incentives are expected to launch soon.' : 'Check with your local utility for additional programs.'}`,
  })

  faq.push({
    question: 'How do I know if I qualify?',
    answer:
      'Qualification is based on your household income relative to your county\'s Area Median Income (AMI). Households earning up to 80% of AMI receive 100% rebate coverage, while those earning 81-150% of AMI receive 50% coverage. Use the calculator above to check your eligibility.',
  })

  faq.push({
    question: 'What upgrades are covered?',
    answer:
      'The HEAR program covers heat pump HVAC systems (up to $8,000), heat pump water heaters (up to $1,750), electrical panel upgrades (up to $4,000), and electrical wiring (up to $2,500). All equipment must meet ENERGY STAR efficiency standards.',
  })

  if (isActive && hasProgram) {
    faq.push({
      question: `What makes ${stateName}'s program special?`,
      answer:
        metadata.notes && metadata.notes.length > 0
          ? metadata.notes.join(' ')
          : `${stateName} has enhanced its rebate program with additional state funding, allowing for higher caps on certain measures and streamlined application processes.`,
    })
  }

  faq.push({
    question: 'How do I apply?',
    answer:
      'First, use the calculator to estimate your rebates. Then, find a participating contractor in your area. Your contractor will help you apply for rebates before starting work. You\'ll need income documentation to verify eligibility.',
  })

  // Additional notes
  const additionalNotes: string[] = metadata.notes || []

  if (isPending && !additionalNotes.length) {
    additionalNotes.push(`${stateName}'s state HEAR program is currently pending approval.`)
    additionalNotes.push('Federal rebates and tax credits are available now.')
  }

  return {
    heroTitle,
    heroSubtitle,
    description,
    faq,
    additionalNotes,
  }
}

/**
 * Fallback content for unknown states
 */
function getDefaultStateContent(stateCode: string): StateContent {
  return {
    heroTitle: 'Energy Rebate Calculator',
    heroSubtitle: 'Find out how much you can save',
    description:
      'Calculate your eligibility for federal HEAR/HOMES rebates and tax credits. The program provides point-of-sale rebates for energy-efficient home improvements including heat pumps, water heaters, and electrical upgrades.',
    faq: [
      {
        question: 'What rebates are available?',
        answer:
          'Federal HEAR rebates provide up to $14,000 for income-qualified households, plus up to $3,200 in federal tax credits. Use the calculator to see your specific eligibility.',
      },
    ],
    additionalNotes: [
      'State-specific program information not available for this location.',
      'Federal rebates and tax credits are available nationwide.',
    ],
  }
}
