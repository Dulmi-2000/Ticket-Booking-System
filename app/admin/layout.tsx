"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAuth} from "@/lib/auth-context";
import {isAdminRole} from "@/lib/roles";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {LayoutDashboard, Calendar, Ticket, ArrowLeft, Settings} from "lucide-react";

const navItems = [
  {href: "/admin", label: "Overview", icon: LayoutDashboard},
  {href: "/admin/events", label: "Event Listings", icon: Calendar},
  {href: "/admin/bookings", label: "Bookings", icon: Ticket},
];

export default function AdminLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const {session, isLoading} = useAuth();
  const isAdmin = isAdminRole(session?.user?.role);

  useEffect(() => {
    if (!isLoading && (!session || !isAdmin)) {
      router.push("/login");
    }
  }, [session, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r border-border bg-card p-4">
          <Skeleton className="mb-8 h-8 w-32 rounded-xl" />
          <div className="space-y-2">
            {Array.from({length: 3}).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="mb-8 h-10 w-48 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border p-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Admin Panel</span>
            </Link>
            <p className="mt-1 text-xs text-muted-foreground ml-10">{session.user.name}</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Management
            </p>
            <ul className="space-y-1">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}>
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                          isActive ? "bg-primary/20" : "bg-muted"
                        }`}>
                        <Icon
                          className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      {item.label}
                      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Settings className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Admin</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl p-2 transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}>
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
          <Link
            href="/"
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-muted/30 pt-14 md:ml-64 md:pt-0">{children}</main>
    </div>
  );
}
