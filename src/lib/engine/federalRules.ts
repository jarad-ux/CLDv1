import { HEAR_CAPS, HEAR_COVERAGE_PERCENTAGE, TAX_CREDIT_25C } from '../federal'
import type { IncomeCategory } from '../federal'

export interface UpgradeCaps {
  heatPump: number
  waterHeater: number
  panel: number
  wiring: number
  householdMax: number
}

export interface FederalRules {
  hearCaps: UpgradeCaps
  coveragePercentage: Record<IncomeCategory, number>
  taxCredit25C: {
    heatPump: number
    waterHeater: number
    panel: number
    annualMax: number
  }
}

export const federalRules: FederalRules = {
  hearCaps: HEAR_CAPS,
  coveragePercentage: HEAR_COVERAGE_PERCENTAGE,
  taxCredit25C: TAX_CREDIT_25C,
}
