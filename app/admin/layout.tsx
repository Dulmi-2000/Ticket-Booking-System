"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isAdminRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  ArrowLeft,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/events", label: "Event listings", icon: Calendar },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { session, isLoading } = useAuth()
  const isAdmin = isAdminRole(session?.user?.role)

  useEffect(() => {
    if (!isLoading && (!session || !isAdmin)) {
      router.push("/login")
    }
  }, [session, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r border-border bg-card p-4">
          <Skeleton className="mb-8 h-8 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="mb-8 h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 md:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-800 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-lg font-bold text-white"
            >
              <Settings className="h-6 w-6 text-cyan-400" />
              Admin Panel
            </Link>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-slate-800 p-4">
            <Button variant="ghost" asChild className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-white"
        >
          <Settings className="h-5 w-5 text-cyan-400" />
          Admin
        </Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md p-2 ${
                pathname === item.href
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-slate-100 pt-14 md:ml-64 md:pt-0 dark:bg-slate-900">
        {children}
      </main>
    </div>
  )
}
