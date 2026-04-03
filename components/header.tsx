// "use client";

// import Link from "next/link";
// import {useAuth} from "@/lib/auth-context";
// import {Button} from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {Ticket, User, LogOut, Calendar, Settings, Menu, X} from "lucide-react";
// import {useState} from "react";
// import {useRouter} from "next/navigation";

// export function Header() {
//   const {session, isLoading, refresh} = useAuth();
//   const router = useRouter();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     await fetch("/api/auth/logout", {method: "POST"});
//     await refresh();
//     router.push("/");
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-background/80">
//       <div className="container mx-auto flex h-16 items-center justify-between px-4">
//         <Link href="/" className="flex items-center gap-2">
//           <Ticket className="h-7 w-7 text-primary" />
//           <span className="text-xl font-bold text-primary font-heading tracking-tight">
//             BookMySeat
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden items-center gap-6 md:flex">
//           <Link
//             href="/events?category=Concerts"
//             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
//             Concerts
//           </Link>
//           <Link
//             href="/events?category=Theatre"
//             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
//             Theatre
//           </Link>
//           <Link
//             href="/events?category=Sports"
//             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
//             Sports
//           </Link>
//           <Link
//             href="/events?category=Family"
//             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
//             Family & Other
//           </Link>
//           {session?.user.role === "admin" && (
//             <Link
//               href="/admin"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
//               Admin Dashboard
//             </Link>
//           )}
//         </nav>

//         {/* Desktop Auth */}
//         <div className="hidden items-center gap-4 md:flex">
//           {isLoading ? (
//             <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
//           ) : session ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="gap-2">
//                   <User className="h-4 w-4" />
//                   <span>{session.user.name}</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuItem asChild>
//                   <Link href="/dashboard" className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     My Bookings
//                   </Link>
//                 </DropdownMenuItem>
//                 {session.user.role === "admin" && (
//                   <DropdownMenuItem asChild>
//                     <Link href="/admin" className="flex items-center gap-2">
//                       <Settings className="h-4 w-4" />
//                       Admin Dashboard
//                     </Link>
//                   </DropdownMenuItem>
//                 )}
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 text-destructive focus:text-destructive">
//                   <LogOut className="h-4 w-4" />
//                   Sign Out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <>
//               {/* <Button variant="ghost" size="sm" asChild>
//                 <Link href="/login">Sign In</Link>
//               </Button> */}
//               <Button size="sm" asChild>
//                 <Link href="/login">Login</Link>
//               </Button>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           aria-label="Toggle menu">
//           {mobileMenuOpen ? (
//             <X className="h-6 w-6 text-foreground" />
//           ) : (
//             <Menu className="h-6 w-6 text-foreground" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden shadow-lg">
//           <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
//             <Link
//               href="/events?category=Concerts"
//               className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
//               onClick={() => setMobileMenuOpen(false)}>
//               Concerts
//             </Link>
//             <Link
//               href="/events?category=Theatre"
//               className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
//               onClick={() => setMobileMenuOpen(false)}>
//               Theatre
//             </Link>
//             <Link
//               href="/events?category=Family"
//               className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
//               onClick={() => setMobileMenuOpen(false)}>
//               Family & Other
//             </Link>
//             {session && (
//               <Link
//                 href="/dashboard"
//                 className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
//                 onClick={() => setMobileMenuOpen(false)}>
//                 My Bookings
//               </Link>
//             )}
//             {session?.user.role === "admin" && (
//               <Link
//                 href="/admin"
//                 className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
//                 onClick={() => setMobileMenuOpen(false)}>
//                 Admin Dashboard
//               </Link>
//             )}
//             <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
//               {session ? (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     handleLogout();
//                     setMobileMenuOpen(false);
//                   }}>
//                   Sign Out
//                 </Button>
//               ) : (
//                 <>
//                   <Button variant="outline" asChild>
//                     <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
//                       Login
//                     </Link>
//                   </Button>
//                   <Button asChild>
//                     <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
//                       Sign Up
//                     </Link>
//                   </Button>
//                 </>
//               )}
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import {useAuth} from "@/lib/auth-context";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Ticket, User, LogOut, Calendar, Settings, Menu, X, ChevronDown} from "lucide-react";
import {useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";

const navLinks = [
  {label: "Concerts", href: "/events?category=Concerts"},
  {label: "Theatre", href: "/events?category=Theatre"},
  {label: "Sports", href: "/events?category=Sports"},
  {label: "Family & Other", href: "/events?category=Family"},
];

export function Header() {
  const {session, isLoading, refresh} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {method: "POST"});
    await refresh();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href.split("?")[0]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Ticket className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground font-heading tracking-tight">
            BookMySeat
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}>
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
          {session?.user.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full pl-2 pr-3 hover:bg-muted">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-xs font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{session.user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                <div className="px-2 py-1.5 mb-1">
                  <p className="text-xs font-medium text-foreground">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg gap-2 cursor-pointer">
                  <Link href="/dashboard">
                    <Calendar className="h-4 w-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "admin" && (
                  <DropdownMenuItem asChild className="rounded-lg gap-2 cursor-pointer">
                    <Link href="/admin">
                      <Settings className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="rounded-full px-5" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background md:hidden transition-colors hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "auto"}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.2, ease: "easeInOut"}}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}

              {session && (
                <Link
                  href="/dashboard"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </Link>
              )}

              {session?.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile auth */}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <span className="text-xs font-semibold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="flex-1 rounded-xl" asChild>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
