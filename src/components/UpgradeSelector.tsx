'use client'

import { Checkbox } from './ui/Checkbox'
import { Label } from './ui/Label'
import { Input } from './ui/Input'

interface UpgradeConfig {
  id: keyof Upgrades
  label: string
  description: string
  defaultCost: number
}

interface Upgrades {
  heatPump: boolean
  waterHeater: boolean
  panel: boolean
  wiring: boolean
}

interface EstimatedCosts {
  heatPump?: number
  waterHeater?: number
  panel?: number
  wiring?: number
}

interface UpgradeSelectorProps {
  upgrades: Upgrades
  estimatedCosts?: EstimatedCosts
  onUpgradeChange: (upgrade: keyof Upgrades, checked: boolean) => void
  onCostChange: (upgrade: keyof Upgrades, cost: number) => void
}

const UPGRADE_OPTIONS: UpgradeConfig[] = [
  {
    id: 'heatPump',
    label: 'Heat Pump HVAC System',
    description: 'Replace traditional heating/cooling with efficient heat pump',
    defaultCost: 12000,
  },
  {
    id: 'waterHeater',
    label: 'Heat Pump Water Heater',
    description: 'Upgrade to energy-efficient water heating',
    defaultCost: 3500,
  },
  {
    id: 'panel',
    label: 'Electrical Panel Upgrade',
    description: 'Upgrade electrical panel to support new equipment',
    defaultCost: 4000,
  },
  {
    id: 'wiring',
    label: 'Electrical Wiring',
    description: 'Upgrade home wiring for new electrical loads',
    defaultCost: 2500,
  },
]

export function UpgradeSelector({
  upgrades,
  estimatedCosts,
  onUpgradeChange,
  onCostChange,
}: UpgradeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Upgrades</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which home improvements you&apos;re considering
        </p>
      </div>

      <div className="space-y-4">
        {UPGRADE_OPTIONS.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={option.id}
                checked={upgrades[option.id]}
                onChange={(e) => onUpgradeChange(option.id, e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>

            {upgrades[option.id] && (
              <div className="ml-7 space-y-2">
                <Label htmlFor={`${option.id}-cost`} className="text-sm">
                  Estimated Cost (optional)
                </Label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id={`${option.id}-cost`}
                    type="number"
                    placeholder={option.defaultCost.toLocaleString()}
                    value={estimatedCosts?.[option.id] || ''}
                    onChange={(e) => onCostChange(option.id, parseInt(e.target.value) || 0)}
                    className="pl-6"
                    min={0}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
