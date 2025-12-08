import { lookupByZip } from './ami'
import { determineIncomeCategory, type IncomeCategory } from './federal'
import { federalRules } from './engine/federalRules'
import { stateOverrides } from './engine/stateOverrides'
import { mergeRules } from './engine/mergeRules'

export interface CalculatorInput {
  stateCode: string
  zip: string
  income: number
  householdSize: number
  upgrades: {
    heatPump: boolean
    waterHeater: boolean
    panel: boolean
    wiring: boolean
  }
  estimatedCosts?: {
    heatPump?: number
    waterHeater?: number
    panel?: number
    wiring?: number
  }
}

export interface CalculatorLineItem {
  id: string
  name: string
  source: 'federal' | 'state' | 'utility'
  amount: number
  notes?: string
}

export interface CalculatorResult {
  incomeCategory: IncomeCategory
  ami: number | null
  county: string | null
  lineItems: CalculatorLineItem[]
  totalRebate: number
  federalTaxCredit: number
  notes: string[]
}

export function calculateRebates(input: CalculatorInput): CalculatorResult {
  const notes: string[] = []
  const lineItems: CalculatorLineItem[] = []

  // Step 1: Look up AMI
  const amiLookup = lookupByZip(input.zip, input.householdSize)

  if (!amiLookup) {
    notes.push(
      `AMI data not available for ZIP ${input.zip}. Using federal rebates only.`
    )
  }

  // Step 2: Determine income category
  const incomeCategory = amiLookup
    ? determineIncomeCategory(input.income, amiLookup.ami)
    : 'overLimit'

  // Step 3: Get applicable rules (federal + state overrides)
  const rules = mergeRules(
    federalRules,
    stateOverrides[input.stateCode.toLowerCase()]
  )

  // Step 4: Calculate HEAR rebates for each upgrade
  const coveragePercent = rules.coveragePercentage[incomeCategory]
  let totalHearRebate = 0

  if (input.upgrades.heatPump && coveragePercent > 0) {
    const estimatedCost = input.estimatedCosts?.heatPump || rules.hearCaps.heatPump
    const rebateAmount = Math.min(
      estimatedCost * coveragePercent,
      rules.hearCaps.heatPump
    )

    lineItems.push({
      id: 'hear-heat-pump',
      name: 'Heat Pump HVAC System (HEAR)',
      source: 'federal',
      amount: Math.round(rebateAmount),
      notes: `Up to $${rules.hearCaps.heatPump.toLocaleString()} cap`,
    })
    totalHearRebate += rebateAmount
  }

  if (input.upgrades.waterHeater && coveragePercent > 0) {
    const estimatedCost = input.estimatedCosts?.waterHeater || rules.hearCaps.waterHeater
    const rebateAmount = Math.min(
      estimatedCost * coveragePercent,
      rules.hearCaps.waterHeater
    )

    lineItems.push({
      id: 'hear-water-heater',
      name: 'Heat Pump Water Heater (HEAR)',
      source: 'federal',
      amount: Math.round(rebateAmount),
      notes: `Up to $${rules.hearCaps.waterHeater.toLocaleString()} cap`,
    })
    totalHearRebate += rebateAmount
  }

  if (input.upgrades.panel && coveragePercent > 0) {
    const estimatedCost = input.estimatedCosts?.panel || rules.hearCaps.panel
    const rebateAmount = Math.min(
      estimatedCost * coveragePercent,
      rules.hearCaps.panel
    )

    lineItems.push({
      id: 'hear-panel',
      name: 'Electrical Panel Upgrade (HEAR)',
      source: 'federal',
      amount: Math.round(rebateAmount),
      notes: `Up to $${rules.hearCaps.panel.toLocaleString()} cap`,
    })
    totalHearRebate += rebateAmount
  }

  if (input.upgrades.wiring && coveragePercent > 0) {
    const estimatedCost = input.estimatedCosts?.wiring || rules.hearCaps.wiring
    const rebateAmount = Math.min(
      estimatedCost * coveragePercent,
      rules.hearCaps.wiring
    )

    lineItems.push({
      id: 'hear-wiring',
      name: 'Electrical Wiring Upgrade (HEAR)',
      source: 'federal',
      amount: Math.round(rebateAmount),
      notes: `Up to $${rules.hearCaps.wiring.toLocaleString()} cap`,
    })
    totalHearRebate += rebateAmount
  }

  // Apply household maximum cap
  if (totalHearRebate > rules.hearCaps.householdMax) {
    const excess = totalHearRebate - rules.hearCaps.householdMax
    notes.push(
      `Total HEAR rebates capped at household maximum of $${rules.hearCaps.householdMax.toLocaleString()} (reduced by $${Math.round(excess).toLocaleString()})`
    )

    // Proportionally reduce each line item
    const reductionFactor = rules.hearCaps.householdMax / totalHearRebate
    lineItems.forEach((item) => {
      if (item.source === 'federal' && item.id.startsWith('hear-')) {
        item.amount = Math.round(item.amount * reductionFactor)
      }
    })

    totalHearRebate = rules.hearCaps.householdMax
  }

  // Step 5: Add state-specific rebates
  if (rules.stateSpecificRebates && rules.stateSpecificRebates.length > 0) {
    rules.stateSpecificRebates.forEach((rebate) => {
      lineItems.push({
        id: rebate.id,
        name: rebate.name,
        source: 'state',
        amount: rebate.amount,
        notes: rebate.notes,
      })
    })
  }

  // Step 6: Calculate 25C Tax Credit (simplified)
  let federalTaxCredit = 0

  if (input.upgrades.heatPump) {
    federalTaxCredit += rules.taxCredit25C.heatPump
  }

  if (input.upgrades.waterHeater) {
    federalTaxCredit += rules.taxCredit25C.waterHeater
  }

  if (input.upgrades.panel) {
    federalTaxCredit += rules.taxCredit25C.panel
  }

  // Apply annual maximum
  federalTaxCredit = Math.min(federalTaxCredit, rules.taxCredit25C.annualMax)

  // Step 7: Calculate total rebate
  const totalRebate = lineItems.reduce((sum, item) => sum + item.amount, 0)

  // Step 8: Add helpful notes
  if (incomeCategory === 'low') {
    notes.push('You qualify for 100% cost coverage on HEAR rebates (up to caps)')
  } else if (incomeCategory === 'moderate') {
    notes.push('You qualify for 50% cost coverage on HEAR rebates (up to caps)')
  } else {
    notes.push(
      'Your income exceeds 150% AMI. You may still qualify for federal 25C tax credits.'
    )
  }

  if (federalTaxCredit > 0) {
    notes.push(
      `You may also qualify for up to $${federalTaxCredit.toLocaleString()} in federal 25C tax credits (claim on tax return)`
    )
  }

  return {
    incomeCategory,
    ami: amiLookup?.ami || null,
    county: amiLookup?.county || null,
    lineItems,
    totalRebate: Math.round(totalRebate),
    federalTaxCredit,
    notes,
  }
}
