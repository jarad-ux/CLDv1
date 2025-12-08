import type { CalculatorResult } from './calculator'

/**
 * MCP HOOK: Enrich calculator results with AI-generated guidance
 *
 * TODO (MCP Integration):
 * - Connect to Claude via MCP tools
 * - Generate personalized homeowner guidance based on:
 *   - Income category
 *   - Selected upgrades
 *   - Regional considerations
 * - Generate contractor recommendations
 * - Provide next steps for application process
 *
 * Expected MCP tool call:
 * - Tool: "generate_rebate_guidance"
 * - Input: CalculatorResult
 * - Output: { advice: string, nextSteps: string[] }
 */
export async function enrichWithGuidance(
  result: CalculatorResult
): Promise<CalculatorResult & { advice?: string }> {
  // Placeholder: return unchanged result
  // Will be replaced with actual MCP call like:
  // const guidance = await mcpClient.callTool('generate_rebate_guidance', { result })
  // return { ...result, advice: guidance.advice }

  console.log('[MCP Placeholder] enrichWithGuidance called with:', {
    incomeCategory: result.incomeCategory,
    totalRebate: result.totalRebate,
    upgradeCount: result.lineItems.length,
  })

  return result
}

/**
 * MCP HOOK: Send lead to downstream automation pipelines
 *
 * TODO (MCP / Automation Integration):
 * - Twilio: Activate dialer workflow
 * - Retell AI: Trigger AI voice agent handoff
 * - CRM: Upsert lead record (Salesforce/HubSpot/etc.)
 * - Email: Send confirmation + next steps
 *
 * Expected MCP tool calls:
 * - Tool: "twilio_create_call"
 * - Tool: "retell_start_conversation"
 * - Tool: "crm_upsert_lead"
 * - Tool: "send_email"
 *
 * @param lead - Lead data from form submission
 * @returns Promise with success status and any errors
 */
export async function sendLeadToPipelines(lead: any): Promise<{
  ok: boolean
  errors?: string[]
}> {
  // Placeholder: just log the lead
  // Will be replaced with actual MCP calls like:
  // await Promise.all([
  //   mcpClient.callTool('twilio_create_call', { phone: lead.phone }),
  //   mcpClient.callTool('retell_start_conversation', { leadId: lead.id }),
  //   mcpClient.callTool('crm_upsert_lead', { lead }),
  //   mcpClient.callTool('send_email', { to: lead.email, template: 'welcome' })
  // ])

  console.log('[MCP Placeholder] sendLeadToPipelines called with:', {
    email: lead.email,
    phone: lead.phone,
    stateCode: lead.stateCode,
    consent: lead.consent,
  })

  return { ok: true }
}

/**
 * MCP HOOK: Generate dynamic state-specific content
 *
 * TODO (MCP Integration):
 * - Generate state landing page content
 * - Create FAQs based on state program rules
 * - Generate utility-specific guidance
 *
 * Expected MCP tool call:
 * - Tool: "generate_state_content"
 * - Input: { stateCode: string, programDetails: any }
 * - Output: { description: string, faqs: Array<{q: string, a: string}> }
 */
export async function generateStateContent(stateCode: string): Promise<{
  description?: string
  faqs?: Array<{ question: string; answer: string }>
}> {
  console.log('[MCP Placeholder] generateStateContent called for:', stateCode)

  return {}
}
