import { z } from 'zod'

// Calculator Input Schema
export const CalculatorInputSchema = z.object({
  stateCode: z.string().min(2).max(2).toLowerCase(),
  zip: z.string().regex(/^\d{5}$/),
  income: z.number().int().min(0),
  householdSize: z.number().int().min(1).max(8),
  upgrades: z.object({
    heatPump: z.boolean(),
    waterHeater: z.boolean(),
    panel: z.boolean(),
    wiring: z.boolean(),
  }),
  estimatedCosts: z.object({
    heatPump: z.number().min(0).optional(),
    waterHeater: z.number().min(0).optional(),
    panel: z.number().min(0).optional(),
    wiring: z.number().min(0).optional(),
  }).optional(),
})

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>

// Lead Schema
export const LeadSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  address: z.string().optional(),
  zip: z.string().regex(/^\d{5}$/).optional(),
  utility: z.string().optional(),
  ownership: z.enum(['homeowner', 'renter', 'other']).optional(),
  fuelType: z.enum(['gas', 'oil', 'propane', 'electric', 'other']).optional(),
  consent: z.boolean(),

  // Calculator context
  stateCode: z.string().min(2).max(2),
  income: z.number().int().min(0).optional(),
  householdSize: z.number().int().min(1).max(8).optional(),
  upgrades: z.object({
    heatPump: z.boolean(),
    waterHeater: z.boolean(),
    panel: z.boolean(),
    wiring: z.boolean(),
  }),
  result: z.any(), // CalculatorResult JSON
})

export type LeadInput = z.infer<typeof LeadSchema>

// Program Resolver Input Schema
export const ProgramResolverInputSchema = z.object({
  stateCode: z.string().min(2).max(2).toLowerCase(),
  zip: z.string().regex(/^\d{5}$/),
  income: z.number().int().min(0).optional(),
  householdSize: z.number().int().min(1).max(8).optional(),
  utilityIds: z.array(z.string()).optional(),
  ownership: z.enum(['homeowner', 'renter']).optional(),
  fuelType: z.enum(['gas', 'oil', 'propane', 'electric']).optional(),
  upgrades: z.object({
    heatPump: z.boolean().optional(),
    waterHeater: z.boolean().optional(),
    panel: z.boolean().optional(),
    wiring: z.boolean().optional(),
    insulation: z.boolean().optional(),
    appliances: z.boolean().optional(),
  }).optional(),
})

export type ProgramResolverInput = z.infer<typeof ProgramResolverInputSchema>
