// src/app/admin/layout.tsx
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="space-y-0.5">
            <h1 className="text-lg font-semibold tracking-tight">CLDv1 Admin</h1>
            <p className="text-xs text-muted-foreground">
              Internal tools for the national rebate registry.
            </p>
          </div>
          <nav className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5">
              Registry
            </span>
            <span className="inline-flex items-center rounded-full border px-2 py-0.5">
              Programs
            </span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
