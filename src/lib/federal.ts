// Federal HEAR/HOMES and 25C Tax Credit Constants

export const INCOME_THRESHOLDS = {
  LOW: 0.8, // 0-80% AMI
  MODERATE: 1.5, // 81-150% AMI
} as const

export const INCOME_CATEGORIES = {
  LOW: 'low',
  MODERATE: 'moderate',
  OVER_LIMIT: 'overLimit',
} as const

export type IncomeCategory = typeof INCOME_CATEGORIES[keyof typeof INCOME_CATEGORIES]

export const HEAR_COVERAGE_PERCENTAGE = {
  low: 1.0, // 100% coverage
  moderate: 0.5, // 50% coverage
  overLimit: 0, // No HEAR rebates
} as const

export const HEAR_CAPS = {
  heatPump: 8000,
  waterHeater: 1750,
  panel: 4000,
  wiring: 2500,
  householdMax: 14000,
} as const

// 25C Tax Credit (simplified - actual rules more complex)
export const TAX_CREDIT_25C = {
  heatPump: 2000, // Up to $2000 for qualified heat pumps
  waterHeater: 2000, // Up to $2000 for qualified heat pump water heaters
  panel: 600, // Up to $600 for electrical panel upgrade
  annualMax: 3200, // $3200 annual cap (2023+)
} as const

export function determineIncomeCategory(
  householdIncome: number,
  ami: number
): IncomeCategory {
  const percentAmi = householdIncome / ami

  if (percentAmi <= INCOME_THRESHOLDS.LOW) {
    return INCOME_CATEGORIES.LOW
  } else if (percentAmi <= INCOME_THRESHOLDS.MODERATE) {
    return INCOME_CATEGORIES.MODERATE
  } else {
    return INCOME_CATEGORIES.OVER_LIMIT
  }
}
