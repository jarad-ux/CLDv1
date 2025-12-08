import type { FederalRules } from './federalRules'

export type StateRebateRules = FederalRules & {
  stateSpecificRebates?: {
    id: string
    name: string
    amount: number
    notes?: string
  }[]
}

// State-specific overrides
export const stateOverrides: Record<string, Partial<StateRebateRules>> = {
  md: {
    // Maryland enhanced rebates
    stateSpecificRebates: [
      {
        id: 'md-mea-bonus',
        name: 'Maryland MEA Additional Rebate',
        amount: 500,
        notes: 'Additional state funding through Maryland Energy Administration',
      },
    ],
  },
  ca: {
    // California TECH Clean California enhancements
    hearCaps: {
      heatPump: 10000, // Enhanced cap
      waterHeater: 2000, // Enhanced cap
      panel: 5000,
      wiring: 3000,
      householdMax: 16000, // Enhanced household max
    },
    stateSpecificRebates: [
      {
        id: 'ca-tech-bonus',
        name: 'CA TECH Clean California Bonus',
        amount: 1000,
        notes: 'State incentive for combined heat pump upgrades',
      },
    ],
  },
  ny: {
    // New York Clean Heat enhancements
    stateSpecificRebates: [
      {
        id: 'ny-clean-heat',
        name: 'NY Clean Heat Program',
        amount: 750,
        notes: 'NYSERDA Clean Heat incentive',
      },
    ],
  },
}
