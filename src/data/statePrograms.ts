/**
 * National HEAR/HOMES Status Registry
 *
 * Tracks rebate program status for all 50 states + DC.
 * This is the single source of truth for state program status.
 */

export type RebateProgramStatus = 'launched' | 'approved' | 'planned' | 'pending' | 'none'

export interface StateProgramStatus {
  stateCode: string // "GA"
  stateName: string // "Georgia"
  hearStatus: RebateProgramStatus
  homesStatus: RebateProgramStatus
  notes?: string
}

export const STATE_PROGRAMS: StateProgramStatus[] = [
  // Tier-1 Launch States (Active Programs)
  {
    stateCode: 'GA',
    stateName: 'Georgia',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Tier-1 launch state; approved contractor pilot active.',
  },
  {
    stateCode: 'NC',
    stateName: 'North Carolina',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Energy Saver NC implementation; streamlined contractor onboarding.',
  },
  {
    stateCode: 'ME',
    stateName: 'Maine',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Efficiency Maine Trust delivery; cold-climate heat pump focus.',
  },
  {
    stateCode: 'NM',
    stateName: 'New Mexico',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Equity-centered; strong tribal and rural outreach.',
  },
  {
    stateCode: 'NY',
    stateName: 'New York',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'NYSERDA coordination; stacks with EmPower/Clean Heat programs.',
  },
  {
    stateCode: 'CA',
    stateName: 'California',
    hearStatus: 'launched',
    homesStatus: 'approved',
    notes: 'TECH Clean California; enhanced rebates beyond federal caps.',
  },
  {
    stateCode: 'CO',
    stateName: 'Colorado',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Strong Xcel Energy coordination; high-altitude heat pump focus.',
  },
  {
    stateCode: 'AZ',
    stateName: 'Arizona',
    hearStatus: 'approved',
    homesStatus: 'approved',
    notes: 'Utility-driven pilot with SRP and APS partnerships.',
  },

  // Planned/Design Phase
  {
    stateCode: 'MD',
    stateName: 'Maryland',
    hearStatus: 'planned',
    homesStatus: 'planned',
    notes: 'HERO/HEAR design phase; layered on EmPOWER Maryland.',
  },
  {
    stateCode: 'FL',
    stateName: 'Florida',
    hearStatus: 'pending',
    homesStatus: 'pending',
    notes: 'Application submitted; federal approval pending.',
  },

  // Remaining States (Alphabetical)
  {
    stateCode: 'AL',
    stateName: 'Alabama',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'AK',
    stateName: 'Alaska',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'AR',
    stateName: 'Arkansas',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'CT',
    stateName: 'Connecticut',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'DE',
    stateName: 'Delaware',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'DC',
    stateName: 'District of Columbia',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'HI',
    stateName: 'Hawaii',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'ID',
    stateName: 'Idaho',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'IL',
    stateName: 'Illinois',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'IN',
    stateName: 'Indiana',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'IA',
    stateName: 'Iowa',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'KS',
    stateName: 'Kansas',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'KY',
    stateName: 'Kentucky',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'LA',
    stateName: 'Louisiana',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MI',
    stateName: 'Michigan',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MN',
    stateName: 'Minnesota',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MS',
    stateName: 'Mississippi',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MO',
    stateName: 'Missouri',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'MT',
    stateName: 'Montana',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'NE',
    stateName: 'Nebraska',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'NV',
    stateName: 'Nevada',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'NH',
    stateName: 'New Hampshire',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'NJ',
    stateName: 'New Jersey',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'ND',
    stateName: 'North Dakota',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'OH',
    stateName: 'Ohio',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'OK',
    stateName: 'Oklahoma',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'OR',
    stateName: 'Oregon',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'RI',
    stateName: 'Rhode Island',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'SC',
    stateName: 'South Carolina',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'SD',
    stateName: 'South Dakota',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'TN',
    stateName: 'Tennessee',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'TX',
    stateName: 'Texas',
    hearStatus: 'pending',
    homesStatus: 'pending',
    notes: 'Deregulated market creates complexity; federal HEAR still available.',
  },
  {
    stateCode: 'UT',
    stateName: 'Utah',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'VT',
    stateName: 'Vermont',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'VA',
    stateName: 'Virginia',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'WA',
    stateName: 'Washington',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'WV',
    stateName: 'West Virginia',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'WI',
    stateName: 'Wisconsin',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
  {
    stateCode: 'WY',
    stateName: 'Wyoming',
    hearStatus: 'pending',
    homesStatus: 'pending',
  },
]

/**
 * Helper to get status for a specific state
 */
export function getStateProgramStatus(stateCode: string): StateProgramStatus | null {
  const normalized = stateCode.toUpperCase()
  return STATE_PROGRAMS.find((s) => s.stateCode === normalized) ?? null
}

/**
 * Helper to get counts by status
 */
export function getProgramStatusCounts() {
  const counts = {
    launched: 0,
    approved: 0,
    planned: 0,
    pending: 0,
    none: 0,
  }

  STATE_PROGRAMS.forEach((state) => {
    // Count based on HEAR status (could also use HOMES or max of both)
    counts[state.hearStatus]++
  })

  return counts
}
