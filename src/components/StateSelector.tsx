'use client'

import { Select } from './ui/Select'
import { Label } from './ui/Label'
import { getAllStates } from '@/lib/states'

interface StateSelectorProps {
  value: string
  onChange: (stateCode: string) => void
}

export function StateSelector({ value, onChange }: StateSelectorProps) {
  const states = getAllStates()

  return (
    <div className="space-y-2">
      <Label htmlFor="state">State</Label>
      <Select
        id="state"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select your state</option>
        {states.map(({ code, metadata }) => (
          <option key={code} value={code.toLowerCase()}>
            {metadata.name}
            {metadata.status === 'active' ? ' ✓' : metadata.status === 'pending' ? ' (Pending)' : ''}
          </option>
        ))}
      </Select>
    </div>
  )
}
