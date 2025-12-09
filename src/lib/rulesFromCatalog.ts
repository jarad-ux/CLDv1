// src/lib/rulesFromCatalog.ts
import { prisma } from '@/lib/prisma'
import { federalRules, type FederalRules } from './engine/federalRules'
import type { StateRebateRules } from './engine/stateOverrides'

type MeasureKey = 'heat-pump-hvac' | 'hpwh' | 'panel' | 'wiring'

function applyCatalogCaps(
  base: FederalRules,
  benefits: { measure: string; amountMax: number | null }[]
): StateRebateRules {
  const caps = { ...base.hearCaps }

  for (const b of benefits) {
    const key = b.measure as MeasureKey
    if (!key || b.amountMax == null) continue
    if (key === 'heat-pump-hvac') caps.heatPump = b.amountMax
    if (key === 'hpwh') caps.waterHeater = b.amountMax
    if (key === 'panel') caps.panel = b.amountMax
    if (key === 'wiring') caps.wiring = b.amountMax
  }

  return {
    ...base,
    hearCaps: caps,
  }
}

export async function getRulesForStateFromCatalog(
  stateCode: string
): Promise<StateRebateRules | null> {
  const upper = stateCode.toUpperCase()

  const programs = await prisma.program.findMany({
    where: {
      jurisdictionType: 'state',
      jurisdictionCode: upper,
      status: 'active',
    },
    include: {
      benefits: true,
    },
  })

  if (!programs.length) return null

  // For now, just merge all state-level benefits together
  const allBenefits = programs.flatMap((p) => p.benefits)

  return applyCatalogCaps(federalRules, allBenefits)
}
