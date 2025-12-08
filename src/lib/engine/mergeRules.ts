import { federalRules, type FederalRules } from './federalRules'
import type { StateRebateRules } from './stateOverrides'

export function mergeRules(
  federal: FederalRules,
  stateOverride: Partial<StateRebateRules> | undefined
): StateRebateRules {
  if (!stateOverride) {
    return federal
  }

  return {
    ...federal,
    ...stateOverride,
    hearCaps: {
      ...federal.hearCaps,
      ...(stateOverride.hearCaps || {}),
    },
    coveragePercentage: {
      ...federal.coveragePercentage,
      ...(stateOverride.coveragePercentage || {}),
    },
    taxCredit25C: {
      ...federal.taxCredit25C,
      ...(stateOverride.taxCredit25C || {}),
    },
    stateSpecificRebates: stateOverride.stateSpecificRebates || [],
  }
}

export function getRulesForState(stateCode: string, stateOverrides: Record<string, Partial<StateRebateRules>>): StateRebateRules {
  const override = stateOverrides[stateCode.toLowerCase()]
  return mergeRules(federalRules, override)
}
