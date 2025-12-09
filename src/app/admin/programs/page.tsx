// src/app/admin/programs/page.tsx
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card'

type ProgramsPageProps = {
  searchParams?: {
    q?: string | string[]
    jurisdictionType?: string | string[]
    status?: string | string[]
  }
}

export const metadata: Metadata = {
  title: 'Program Registry Admin | CLDv1',
  description:
    'Internal view of all federal, state, utility, and local rebate programs modeled in CLDv1.',
}

// Helper: normalize query param (string | string[] | undefined) -> string | undefined
function getParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

// Optional: human labels for jurisdiction types
const JURISDICTION_LABELS: Record<string, string> = {
  federal: 'Federal',
  state: 'State',
  utility: 'Utility',
  local: 'Local',
  manufacturer: 'Manufacturer',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  planned: 'Planned',
  sunset: 'Sunset',
  closed: 'Closed',
}

export default async function ProgramsAdminPage({ searchParams }: ProgramsPageProps) {
  const q = getParam(searchParams?.q)?.trim()
  const jurisdictionType = getParam(searchParams?.jurisdictionType)
  const status = getParam(searchParams?.status)

  const where: Prisma.ProgramWhereInput = {}

  if (jurisdictionType && jurisdictionType !== 'all') {
    where.jurisdictionType = jurisdictionType
  }

  if (status && status !== 'all') {
    where.status = status
  }

  if (q) {
    // Basic OR search across name, slug, jurisdictionCode
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { jurisdictionCode: { contains: q, mode: 'insensitive' } },
    ]
  }

  const programs = await prisma.program.findMany({
    where,
    orderBy: [
      { jurisdictionType: 'asc' },
      { jurisdictionCode: 'asc' },
      { name: 'asc' },
    ],
  })

  const totalCount = await prisma.program.count()
  const filteredCount = programs.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Program Registry</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Read-only view of all rebate programs modeled in CLDv1. Filter by jurisdiction,
          status, or search by name, slug, or utility code. This is the truth layer that
          feeds the resolver and state registry.
        </p>
      </div>

      {/* Filters + summary */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Showing {filteredCount} of {totalCount} programs in the catalog.
            </CardDescription>
          </div>

          {/* Simple GET form, no client JS needed */}
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" action="/admin/programs">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Search
              </label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search by name, slug, or utility code…"
                className="block w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
              />
            </div>

            <div className="w-full sm:w-40">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Jurisdiction
              </label>
              <select
                name="jurisdictionType"
                defaultValue={jurisdictionType ?? 'all'}
                className="block w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
              >
                <option value="all">All types</option>
                <option value="federal">Federal</option>
                <option value="state">State</option>
                <option value="utility">Utility</option>
                <option value="local">Local</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
            </div>

            <div className="w-full sm:w-40">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select
                name="status"
                defaultValue={status ?? 'all'}
                className="block w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="planned">Planned</option>
                <option value="sunset">Sunset</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex w-full justify-end sm:w-auto">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-slate-900 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
          </form>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>
            Canonical list of federal, state, and utility programs. Edit flows can hang off
            this later; for now it&apos;s your glass box into the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Jurisdiction</th>
                <th className="px-3 py-2 text-left">Code</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Slug</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                  >
                    No programs match these filters yet. Try widening your search.
                  </td>
                </tr>
              )}

              {programs.map((program) => (
                <tr
                  key={program.id}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2 align-top font-medium text-slate-900">
                    {program.name}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-700">
                    <div className="flex flex-col">
                      <span>
                        {JURISDICTION_LABELS[program.jurisdictionType] ??
                          program.jurisdictionType}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-xs text-slate-600">
                    {program.jurisdictionCode}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-700">
                    {program.programType}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                      {STATUS_LABELS[program.status] ?? program.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-xs text-slate-600">
                    {program.slug}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
