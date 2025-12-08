import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { STATE_PROGRAMS } from '@/data/statePrograms'

const prisma = new PrismaClient()

/**
 * GET /api/states
 *
 * Returns:
 *  - HEAR/HOMES status for all 50 states + DC
 *  - Program counts per state from Program catalog
 *  - National summary statistics
 */
export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    // Group counts of programs by jurisdictionCode
    const programCounts = await prisma.program.groupBy({
      by: ['jurisdictionCode'],
      _count: { _all: true },
    })

    const countsMap = new Map<string, number>()
    for (const row of programCounts) {
      countsMap.set(row.jurisdictionCode, row._count._all)
    }

    // Combine status data with program counts
    const states = STATE_PROGRAMS.map((state) => {
      const code = state.stateCode.toUpperCase()
      const programCount = countsMap.get(code) ?? 0

      return {
        ...state,
        programCount,
      }
    })

    // Calculate national summary
    const totalPrograms = programCounts.reduce((sum, row) => sum + row._count._all, 0) || 0

    const statusCounts = {
      launched: 0,
      approved: 0,
      planned: 0,
      pending: 0,
      none: 0,
    }

    states.forEach((state) => {
      statusCounts[state.hearStatus]++
    })

    return NextResponse.json({
      totalPrograms,
      totalStates: states.length,
      statusCounts,
      states,
    })
  } catch (error) {
    console.error('Error in /api/states', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
