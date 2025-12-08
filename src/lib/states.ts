import statesData from '@/data/states.json'

export interface StateMetadata {
  name: string
  status: 'active' | 'pending' | 'not-available'
  hasHearProgram: boolean
  programName?: string
  tagline?: string
  notes?: string[]
}

export function getStateMetadata(stateCode: string): StateMetadata | null {
  const normalized = stateCode.toLowerCase()
  const data = (statesData as Record<string, StateMetadata>)[normalized]
  return data || null
}

export function getAllStates(): Array<{ code: string; metadata: StateMetadata }> {
  return Object.entries(statesData as Record<string, StateMetadata>).map(
    ([code, metadata]) => ({
      code: code.toUpperCase(),
      metadata,
    })
  )
}

export function isStateActive(stateCode: string): boolean {
  const metadata = getStateMetadata(stateCode)
  return metadata?.status === 'active'
}
