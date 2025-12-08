import { PrismaClient } from '@prisma/client'

/**
 * Program Catalog Seed
 *
 * Seeds the national rebate registry with comprehensive programs:
 * - Federal 25C Tax Credit (all measures)
 * - HEAR/HOMES programs for tier-1 states (GA, NC, MD)
 * - Major utility programs:
 *   - Georgia Power (GA)
 *   - Southern California Edison / SCE (CA)
 *   - Pacific Gas & Electric / PG&E (CA)
 *   - Duke Energy (Multi-state: NC, SC, FL, IN, OH, KY)
 *   - Xcel Energy (Multi-state: CO, MN, WI, MI, NM, TX)
 *   - Con Edison / ConEd (NY)
 *   - Commonwealth Edison / ComEd (IL)
 *
 * All upserts are idempotent - safe to run multiple times.
 * Total programs: 16 (1 federal + 5 state + 10 utility)
 */

const PROGRAM_DEFINITIONS = [
  // ===== FEDERAL PROGRAMS =====
  {
    program: {
      slug: 'federal-25c-tax-credit',
      name: 'Federal 25C Energy Efficient Home Improvement Tax Credit',
      jurisdictionType: 'federal',
      jurisdictionCode: 'US',
      programType: 'tax-credit',
      status: 'active',
      administeringEntity: 'Internal Revenue Service (IRS)',
      urlOfficial: 'https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit',
      summaryShort: '30% tax credit up to $3,200/year for energy-efficient home upgrades',
      summaryLong:
        'The Energy Efficient Home Improvement Credit (25C) provides a 30% tax credit for qualified energy efficiency improvements, including heat pumps, heat pump water heaters, electrical panel upgrades, and insulation. Annual cap is $3,200 ($2,000 for HVAC, $1,200 for other improvements). Available through 2032.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'percent-of-cost',
        percent: 0.3,
        amountMax: 2000,
        notes: 'Up to $2,000 annual cap for heat pumps and biomass stoves combined',
      },
      {
        measure: 'hpwh',
        structure: 'percent-of-cost',
        percent: 0.3,
        amountMax: 2000,
        notes: 'Up to $2,000 annual cap (shares cap with heat pumps)',
      },
      {
        measure: 'panel',
        structure: 'percent-of-cost',
        percent: 0.3,
        amountMax: 600,
        notes: 'Up to $600 for electrical panel upgrades (shares $1,200 non-HVAC cap)',
      },
      {
        measure: 'wiring',
        structure: 'percent-of-cost',
        percent: 0.3,
        amountMax: 600,
        notes: 'Up to $600 for electrical wiring (shares $1,200 non-HVAC cap)',
      },
      {
        measure: 'insulation',
        structure: 'percent-of-cost',
        percent: 0.3,
        amountMax: 1200,
        notes: 'Up to $1,200 for insulation and air sealing',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: { scope: 'national', note: 'Available to all US taxpayers' },
      },
      {
        ruleType: 'building-type',
        definition: {
          allowedTypes: ['single-family', 'multi-family', 'manufactured'],
          note: 'Must be existing home (principal or secondary residence)',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: {
          requirements: 'ENERGY STAR certified or equivalent efficiency standards',
          note: 'Heat pumps must meet ENERGY STAR requirements or equivalent',
        },
      },
    ],
    sources: [
      {
        title: 'IRS Publication on Energy Efficient Home Improvement Credit',
        url: 'https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit',
        sourceType: 'guidance',
      },
    ],
  },

  // ===== GEORGIA PROGRAMS =====
  {
    program: {
      slug: 'ga-hear',
      name: 'Georgia Home Electrification & Appliance Rebates (HEAR)',
      jurisdictionType: 'state',
      jurisdictionCode: 'GA',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Georgia Environmental Finance Authority',
      urlOfficial: 'https://gefa.georgia.gov/',
      summaryShort: 'Up to $14,000 in rebates for heat pumps, water heaters, and electrical upgrades',
      summaryLong:
        'Georgia HEAR provides point-of-sale rebates for home electrification: up to $8,000 for heat pumps, $1,750 for heat pump water heaters, $4,000 for electrical panels, and $2,500 for wiring. Low-income households (≤80% AMI) receive 100% of costs up to caps; moderate-income (80-150% AMI) receive 50%.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 8000,
        householdCap: 14000,
        notes: 'Up to $8,000 for qualified heat pump HVAC systems',
      },
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 1750,
        householdCap: 14000,
        notes: 'Up to $1,750 for heat pump water heaters',
      },
      {
        measure: 'panel',
        structure: 'fixed',
        amountMax: 4000,
        householdCap: 14000,
        notes: 'Up to $4,000 for electrical panel upgrades',
      },
      {
        measure: 'wiring',
        structure: 'fixed',
        amountMax: 2500,
        householdCap: 14000,
        notes: 'Up to $2,500 for electrical wiring',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'income',
        definition: {
          tiers: {
            low: { maxPercentAMI: 0.8, coverage: 1.0 },
            moderate: { minPercentAMI: 0.8, maxPercentAMI: 1.5, coverage: 0.5 },
          },
          note: 'Income verification required; rebate amount based on AMI tier',
        },
      },
      {
        ruleType: 'territory',
        definition: { stateCode: 'GA', note: 'Georgia residents only' },
      },
      {
        ruleType: 'equipment-spec',
        definition: {
          requirements: 'ENERGY STAR certified, installed by approved contractor',
        },
      },
    ],
    sources: [
      {
        title: 'Georgia HEAR Program Guidelines',
        url: 'https://gefa.georgia.gov/hear',
        sourceType: 'guidance',
      },
    ],
  },
  {
    program: {
      slug: 'ga-homes',
      name: 'Georgia Home Owner Managing Energy Savings (HOMES)',
      jurisdictionType: 'state',
      jurisdictionCode: 'GA',
      programType: 'performance',
      status: 'active',
      administeringEntity: 'Georgia Environmental Finance Authority',
      urlOfficial: 'https://gefa.georgia.gov/',
      summaryShort: 'Performance-based rebates up to $16,000 for whole-home energy savings',
      summaryLong:
        'Georgia HOMES provides rebates based on modeled energy savings from whole-home retrofits. Projects achieving ≥35% energy savings are eligible for enhanced rebates up to $16,000. Requires pre- and post-retrofit energy assessments.',
    },
    benefits: [
      {
        measure: 'whole-home-retrofit',
        structure: 'performance',
        amountMax: 16000,
        notes:
          'Up to $16,000 for projects achieving ≥35% energy savings; lower rebates for 20-35% savings',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'income',
        definition: {
          tiers: {
            low: { maxPercentAMI: 0.8, coverage: 1.0 },
            moderate: { minPercentAMI: 0.8, maxPercentAMI: 1.5, coverage: 0.5 },
          },
        },
      },
      {
        ruleType: 'territory',
        definition: { stateCode: 'GA' },
      },
      {
        ruleType: 'equipment-spec',
        definition: {
          requirements:
            'Requires pre- and post-retrofit energy assessment; minimum 20% modeled energy savings',
        },
      },
    ],
    sources: [
      {
        title: 'Georgia HOMES Program Guidelines',
        url: 'https://gefa.georgia.gov/homes',
        sourceType: 'guidance',
      },
    ],
  },

  // ===== NORTH CAROLINA PROGRAMS =====
  {
    program: {
      slug: 'nc-hear',
      name: 'North Carolina Home Energy Rebate Program',
      jurisdictionType: 'state',
      jurisdictionCode: 'NC',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'North Carolina Department of Environmental Quality',
      urlOfficial: 'https://deq.nc.gov/',
      summaryShort: 'Up to $14,000 in rebates for heat pumps and electrification upgrades',
      summaryLong:
        'North Carolina HEAR provides income-qualified rebates for home electrification. One of the first states to launch with streamlined contractor onboarding and simplified income verification.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 8000,
        householdCap: 14000,
        notes: 'Up to $8,000 for heat pump HVAC',
      },
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 1750,
        householdCap: 14000,
        notes: 'Up to $1,750 for heat pump water heaters',
      },
      {
        measure: 'panel',
        structure: 'fixed',
        amountMax: 4000,
        householdCap: 14000,
        notes: 'Up to $4,000 for electrical panel',
      },
      {
        measure: 'wiring',
        structure: 'fixed',
        amountMax: 2500,
        householdCap: 14000,
        notes: 'Up to $2,500 for wiring',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'income',
        definition: {
          tiers: {
            low: { maxPercentAMI: 0.8, coverage: 1.0 },
            moderate: { minPercentAMI: 0.8, maxPercentAMI: 1.5, coverage: 0.5 },
          },
        },
      },
      {
        ruleType: 'territory',
        definition: { stateCode: 'NC' },
      },
    ],
    sources: [
      {
        title: 'NC DEQ Energy Rebate Program',
        url: 'https://deq.nc.gov/energy-rebates',
        sourceType: 'guidance',
      },
    ],
  },
  {
    program: {
      slug: 'nc-homes',
      name: 'North Carolina HOMES Rebates',
      jurisdictionType: 'state',
      jurisdictionCode: 'NC',
      programType: 'performance',
      status: 'active',
      administeringEntity: 'North Carolina Department of Environmental Quality',
      summaryShort: 'Performance-based rebates for whole-home energy improvements',
      summaryLong:
        'Rebates based on modeled energy savings from comprehensive home retrofits. Minimum 20% energy savings required.',
    },
    benefits: [
      {
        measure: 'whole-home-retrofit',
        structure: 'performance',
        amountMax: 14000,
        notes: 'Based on % energy savings achieved; requires energy assessment',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'income',
        definition: {
          tiers: {
            low: { maxPercentAMI: 0.8 },
            moderate: { minPercentAMI: 0.8, maxPercentAMI: 1.5 },
          },
        },
      },
      {
        ruleType: 'territory',
        definition: { stateCode: 'NC' },
      },
    ],
    sources: [
      {
        title: 'NC HOMES Program',
        url: 'https://deq.nc.gov/homes',
        sourceType: 'guidance',
      },
    ],
  },

  // ===== MARYLAND PROGRAMS =====
  {
    program: {
      slug: 'md-hear',
      name: 'Maryland Home Energy Rebate Program',
      jurisdictionType: 'state',
      jurisdictionCode: 'MD',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Maryland Energy Administration (MEA)',
      urlOfficial: 'https://energy.maryland.gov/',
      summaryShort: 'Up to $14,000 for heat pumps and electrification through MEA',
      summaryLong:
        'Maryland HEAR coordinated by MEA stacks with utility rebates from BGE, Pepco, and Delmarva. Income documentation required at application.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 8000,
        householdCap: 14000,
      },
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 1750,
        householdCap: 14000,
      },
      {
        measure: 'panel',
        structure: 'fixed',
        amountMax: 4000,
        householdCap: 14000,
      },
      {
        measure: 'wiring',
        structure: 'fixed',
        amountMax: 2500,
        householdCap: 14000,
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'income',
        definition: {
          tiers: {
            low: { maxPercentAMI: 0.8, coverage: 1.0 },
            moderate: { minPercentAMI: 0.8, maxPercentAMI: 1.5, coverage: 0.5 },
          },
          note: 'Income documentation required at application',
        },
      },
      {
        ruleType: 'territory',
        definition: { stateCode: 'MD' },
      },
    ],
    sources: [
      {
        title: 'MEA HEAR Program',
        url: 'https://energy.maryland.gov/hear',
        sourceType: 'guidance',
      },
    ],
  },

  // ===== UTILITY PROGRAMS =====

  // Georgia Power
  {
    program: {
      slug: 'georgia-power-hpwh-rebate',
      name: 'Georgia Power Heat Pump Water Heater Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'GA_POWER',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Georgia Power Company',
      urlOfficial: 'https://www.georgiapower.com/residential/save-money-and-energy/rebates.html',
      summaryShort: 'Up to $350 rebate for ENERGY STAR heat pump water heaters',
      summaryLong:
        'Georgia Power customers can receive a $350 rebate for qualifying ENERGY STAR heat pump water heaters. Stacks with federal 25C tax credit and Georgia HEAR rebates.',
    },
    benefits: [
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 350,
        notes: 'ENERGY STAR certified HPWH required',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'Georgia Power service area',
          note: 'Must be Georgia Power residential customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'ENERGY STAR certified heat pump water heater' },
      },
    ],
    sources: [
      {
        title: 'Georgia Power Residential Rebates',
        url: 'https://www.georgiapower.com/residential/save-money-and-energy/rebates.html',
        sourceType: 'tariff',
      },
    ],
  },

  // Southern California Edison (SCE)
  {
    program: {
      slug: 'sce-hpwh',
      name: 'SCE Heat Pump Water Heater Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'SCE',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Southern California Edison',
      urlOfficial: 'https://www.sce.com/residential/rebates-savings/rebates-by-product/water-heating',
      summaryShort: 'Rebate for qualifying heat pump water heater installations in SCE territory',
      summaryLong:
        'Southern California Edison offers bill-credit style rebates for qualifying heat pump water heaters installed in eligible single-family homes within SCE electric service territory. Incentives typically stack with federal tax credits and statewide TECH/HEEHRA incentives where allowed.',
    },
    benefits: [
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 1000,
        notes: 'Representative value; confirm current SCE schedule before quoting',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'SCE service area',
          note: 'Must be SCE residential electric customer',
        },
      },
    ],
    sources: [
      {
        title: 'SCE Water Heating Rebates',
        url: 'https://www.sce.com/residential/rebates-savings',
        sourceType: 'tariff',
      },
    ],
  },
  {
    program: {
      slug: 'sce-heat-pump-hvac',
      name: 'SCE Heat Pump HVAC Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'SCE',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Southern California Edison',
      urlOfficial: 'https://www.sce.com/residential/rebates-savings/rebates-by-product/heating-cooling',
      summaryShort: 'Rebate for high-efficiency heat pump HVAC systems in SCE territory',
      summaryLong:
        'SCE provides incentives for qualifying split and package heat pump systems meeting program efficiency tiers. Incentives typically stack with TECH Clean California and federal tax credits, subject to program rules.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'per-ton',
        amountMax: 4000,
        notes: 'Modeled as per-ton rebate with example cap; confirm SCE schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'SCE service area',
          note: 'Must be SCE residential electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet SCE efficiency tiers for qualifying heat pumps' },
      },
    ],
    sources: [
      {
        title: 'SCE Heating & Cooling Rebates',
        url: 'https://www.sce.com/residential/rebates-savings',
        sourceType: 'tariff',
      },
    ],
  },

  // Pacific Gas & Electric (PG&E)
  {
    program: {
      slug: 'pge-hpwh',
      name: 'PG&E Heat Pump Water Heater Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'PGE',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Pacific Gas and Electric Company',
      urlOfficial: 'https://www.pge.com/en_US/residential/save-energy-money/savings-solutions-and-rebates/rebates-by-product/water-heating-rebates.page',
      summaryShort: 'Rebate for qualifying heat pump water heaters in PG&E territory',
      summaryLong:
        'PG&E offers rebates for qualifying ENERGY STAR heat pump water heaters for residential customers. Stacks with federal tax credits and California TECH Clean California programs.',
    },
    benefits: [
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 800,
        notes: 'Example value; verify current PG&E rebate schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'PG&E service area',
          note: 'Must be PG&E residential gas or electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'ENERGY STAR certified heat pump water heater' },
      },
    ],
    sources: [
      {
        title: 'PG&E Water Heating Rebates',
        url: 'https://www.pge.com/rebates',
        sourceType: 'tariff',
      },
    ],
  },
  {
    program: {
      slug: 'pge-heat-pump-hvac',
      name: 'PG&E Heat Pump HVAC Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'PGE',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Pacific Gas and Electric Company',
      urlOfficial: 'https://www.pge.com/en_US/residential/save-energy-money/savings-solutions-and-rebates/rebates-by-product/heating-cooling-rebates.page',
      summaryShort: 'Rebate for high-efficiency central heat pump systems in PG&E territory',
      summaryLong:
        'PG&E provides rebates for qualifying high-efficiency central heat pump systems. Rebates vary based on system efficiency and size. Can stack with TECH Clean California and federal incentives.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'per-ton',
        amountMax: 3500,
        notes: 'Per-ton structure with example cap; confirm current PG&E schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'PG&E service area',
          note: 'Must be PG&E residential customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet PG&E efficiency requirements for heat pumps' },
      },
    ],
    sources: [
      {
        title: 'PG&E Heating & Cooling Rebates',
        url: 'https://www.pge.com/rebates',
        sourceType: 'tariff',
      },
    ],
  },

  // Duke Energy (Multi-State)
  {
    program: {
      slug: 'duke-energy-heat-pump',
      name: 'Duke Energy Heat Pump Incentive',
      jurisdictionType: 'utility',
      jurisdictionCode: 'DUKE_ENERGY',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Duke Energy',
      urlOfficial: 'https://www.duke-energy.com/home/products/air-source-heat-pump',
      summaryShort: 'Heat pump incentives for eligible Duke Energy residential customers across multiple states',
      summaryLong:
        'Duke Energy offers prescriptive incentives for qualifying central heat pump installations in select territories across NC, SC, FL, IN, OH, and KY. Incentive levels and eligibility vary by state and tariff, but can typically stack with federal tax credits and state-level programs.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 1500,
        notes: 'Generic modeled value across territories; confirm specific program schedule per state',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'Duke Energy service areas (NC, SC, FL, IN, OH, KY)',
          note: 'Must be Duke Energy residential customer; varies by state',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet Duke Energy efficiency standards' },
      },
    ],
    sources: [
      {
        title: 'Duke Energy Heating & Cooling Programs',
        url: 'https://www.duke-energy.com/home/products',
        sourceType: 'tariff',
      },
    ],
  },

  // Xcel Energy (Multi-State)
  {
    program: {
      slug: 'xcel-heat-pump-hvac',
      name: 'Xcel Energy Heat Pump Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'XCEL_ENERGY',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Xcel Energy',
      urlOfficial: 'https://www.xcelenergy.com/programs_and_rebates/residential_programs_and_rebates/heating_and_cooling_rebates',
      summaryShort: 'Rebates for high-efficiency heat pump systems across Xcel territories',
      summaryLong:
        'Xcel Energy offers some of the highest utility heat pump rebates in the nation across service territories in CO, MN, WI, MI, NM, and TX. Rebates vary by state and system efficiency tier. Can stack with federal tax credits and state HEAR/HOMES programs.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 2500,
        notes: 'Varies by state and efficiency tier; CO territories often have highest rebates',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'Xcel Energy service areas (CO, MN, WI, MI, NM, TX)',
          note: 'Must be Xcel Energy electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet Xcel efficiency tiers; cold-climate HP focus in northern territories' },
      },
    ],
    sources: [
      {
        title: 'Xcel Energy Heating & Cooling Rebates',
        url: 'https://www.xcelenergy.com/programs_and_rebates',
        sourceType: 'tariff',
      },
    ],
  },
  {
    program: {
      slug: 'xcel-hpwh',
      name: 'Xcel Energy Heat Pump Water Heater Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'XCEL_ENERGY',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Xcel Energy',
      urlOfficial: 'https://www.xcelenergy.com/programs_and_rebates/residential_programs_and_rebates/water_heating_rebates',
      summaryShort: 'Rebates for ENERGY STAR heat pump water heaters',
      summaryLong:
        'Xcel Energy provides rebates for qualifying ENERGY STAR heat pump water heater installations across residential territories. Can combine with federal tax credits and state incentives.',
    },
    benefits: [
      {
        measure: 'hpwh',
        structure: 'fixed',
        amountMax: 750,
        notes: 'Varies by territory; confirm current schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'Xcel Energy service areas',
          note: 'Must be Xcel Energy electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'ENERGY STAR certified heat pump water heater' },
      },
    ],
    sources: [
      {
        title: 'Xcel Energy Water Heating Rebates',
        url: 'https://www.xcelenergy.com/programs_and_rebates',
        sourceType: 'tariff',
      },
    ],
  },

  // Con Edison (New York)
  {
    program: {
      slug: 'coned-heat-pump',
      name: 'Con Edison Clean Heat Program',
      jurisdictionType: 'utility',
      jurisdictionCode: 'CONED',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Consolidated Edison Company of New York',
      urlOfficial: 'https://www.coned.com/en/save-money/rebates-incentives-tax-credits/rebates-incentives-tax-credits-for-residential-customers/heat-pumps',
      summaryShort: 'Incentives for heat pump installations in ConEd territory',
      summaryLong:
        'Con Edison offers rebates for qualifying air-source heat pumps, including cold-climate models, for residential customers in NYC and Westchester. Stacks with NYSERDA programs, federal tax credits, and NY HEAR/HOMES rebates where applicable.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 2000,
        notes: 'Enhanced rebates for cold-climate heat pumps; confirm current ConEd schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'Con Edison service area (NYC, Westchester)',
          note: 'Must be ConEd electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet ConEd efficiency standards; cold-climate HP preferred' },
      },
    ],
    sources: [
      {
        title: 'ConEd Heat Pump Rebates',
        url: 'https://www.coned.com/rebates',
        sourceType: 'tariff',
      },
    ],
  },

  // ComEd (Illinois)
  {
    program: {
      slug: 'comed-heat-pump',
      name: 'ComEd Electric HVAC Rebate',
      jurisdictionType: 'utility',
      jurisdictionCode: 'COMED',
      programType: 'rebate',
      status: 'active',
      administeringEntity: 'Commonwealth Edison Company',
      urlOfficial: 'https://www.comed.com/WaysToSave/ForYourHome/Pages/HVACRebates.aspx',
      summaryShort: 'Rebates for efficient electric HVAC systems in ComEd territory',
      summaryLong:
        'ComEd provides rebates for qualifying high-efficiency electric heating and cooling systems, including heat pumps, for residential customers in northern Illinois. Can combine with federal tax credits.',
    },
    benefits: [
      {
        measure: 'heat-pump-hvac',
        structure: 'fixed',
        amountMax: 1200,
        notes: 'Varies by system efficiency; confirm current ComEd schedule',
      },
    ],
    eligibilityRules: [
      {
        ruleType: 'territory',
        definition: {
          utilityTerritory: 'ComEd service area (northern Illinois)',
          note: 'Must be ComEd residential electric customer',
        },
      },
      {
        ruleType: 'equipment-spec',
        definition: { requirements: 'Must meet ComEd efficiency standards' },
      },
    ],
    sources: [
      {
        title: 'ComEd HVAC Rebates',
        url: 'https://www.comed.com/WaysToSave',
        sourceType: 'tariff',
      },
    ],
  },
]

export async function seedInitialPrograms(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding program catalog...')

  for (const def of PROGRAM_DEFINITIONS) {
    const { program, benefits, eligibilityRules, sources } = def

    // Upsert program
    const createdProgram = await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        name: program.name,
        jurisdictionType: program.jurisdictionType,
        jurisdictionCode: program.jurisdictionCode,
        programType: program.programType,
        status: program.status,
        administeringEntity: program.administeringEntity,
        urlOfficial: program.urlOfficial,
        summaryShort: program.summaryShort,
        summaryLong: program.summaryLong,
      },
      create: program,
    })

    console.log(`  ✓ ${createdProgram.name}`)

    // Delete existing related records to ensure clean state
    await prisma.benefit.deleteMany({ where: { programId: createdProgram.id } })
    await prisma.eligibilityRule.deleteMany({ where: { programId: createdProgram.id } })
    await prisma.sourceDocument.deleteMany({ where: { programId: createdProgram.id } })

    // Create benefits
    if (benefits && benefits.length > 0) {
      await prisma.benefit.createMany({
        data: benefits.map((b) => ({ ...b, programId: createdProgram.id })),
      })
    }

    // Create eligibility rules
    if (eligibilityRules && eligibilityRules.length > 0) {
      await prisma.eligibilityRule.createMany({
        data: eligibilityRules.map((r) => ({ ...r, programId: createdProgram.id })),
      })
    }

    // Create source documents
    if (sources && sources.length > 0) {
      await prisma.sourceDocument.createMany({
        data: sources.map((s) => ({ ...s, programId: createdProgram.id })),
      })
    }
  }

  console.log(`✅ Seeded ${PROGRAM_DEFINITIONS.length} programs with benefits and rules\n`)
}

// Standalone execution support
if (require.main === module) {
  const prisma = new PrismaClient()
  seedInitialPrograms(prisma)
    .then(() => {
      console.log('Seed complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
