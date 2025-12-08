'use client'

import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { formatZip } from '@/utils/format'

interface IncomeFormProps {
  zip: string
  income: number
  householdSize: number
  onZipChange: (zip: string) => void
  onIncomeChange: (income: number) => void
  onHouseholdSizeChange: (size: number) => void
}

export function IncomeForm({
  zip,
  income,
  householdSize,
  onZipChange,
  onIncomeChange,
  onHouseholdSizeChange,
}: IncomeFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zip">ZIP Code</Label>
        <Input
          id="zip"
          type="text"
          placeholder="12345"
          value={zip}
          onChange={(e) => onZipChange(formatZip(e.target.value))}
          maxLength={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="income">Annual Household Income</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="income"
            type="number"
            placeholder="75000"
            value={income || ''}
            onChange={(e) => onIncomeChange(parseInt(e.target.value) || 0)}
            className="pl-6"
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="householdSize">Household Size</Label>
        <Input
          id="householdSize"
          type="number"
          placeholder="3"
          value={householdSize || ''}
          onChange={(e) =>
            onHouseholdSizeChange(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))
          }
          min={1}
          max={8}
        />
        <p className="text-xs text-muted-foreground">
          Number of people living in your household
        </p>
      </div>
    </div>
  )
}
