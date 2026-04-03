// import {Header} from "@/components/header";
// import {Footer} from "@/components/footer";
// import {FeaturedEvents} from "@/components/featured-events";
// import {Music, Trophy, Film, Utensils} from "lucide-react";
// import Link from "next/link";
// import HeroSection from "@/components/hero";
// import {GiMusicalNotes, GiPartyFlags} from "react-icons/gi";
// import TestimonialsSection from "@/components/TestimonialsSection";

// const categories = [
//   {name: "Concerts", icon: GiMusicalNotes, color: "text-pink-500"},
//   {name: "Theatre", icon: Film, color: "text-yellow-500"},
//   {name: "Sports", icon: Trophy, color: "text-orange-500"},
//   {name: "Family & Other", icon: GiPartyFlags, color: "text-red-500"},
// ];

// export default function HomePage() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <main className="flex-1">
//         <HeroSection />

//         {/* Categories Section */}
//         <section className="bg-muted/30 py-16 relative">
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
//           <div className="relative container mx-auto px-4">
//             <h2 className="mb-10 text-center text-3xl font-heading font-bold text-foreground">
//               Browse by Category
//             </h2>
//             <div>
//               <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-4 ">
//                 {categories.map(category => (
//                   <Link
//                     key={category.name}
//                     href={`/events?category=${encodeURIComponent(category.name)}`}
//                     className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl shadow-sm">
//                     <category.icon
//                       className={`h-10 w-10 ${category.color} transition-transform duration-300 group-hover:scale-110`}
//                     />
//                     <span className="text-sm font-semibold text-foreground">{category.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <FeaturedEvents />

//         {/* What People Say Section */}
//         {/* <section className="py-20 border-t border-border bg-background">
//           <div className="container mx-auto px-4 max-w-4xl text-center">
//             <h2 className="mb-8 text-3xl font-heading font-bold text-foreground">
//               What People Say
//             </h2>
//             <div className="relative p-10 md:p-14 rounded-3xl bg-card border border-border shadow-2xl pt-14">
//               <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg text-primary-foreground">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   stroke="none">
//                   <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
//                 </svg>
//               </div>
//               <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic font-medium">
//                 &quot;BookMySeat is one of the fast-growing ticket marketplaces that includes events
//                 of music, sport, art, theatre, and more in Sri Lanka. It is capable to accommodate
//                 events of all types, sizes, and complexities with the state-of-the-art
//                 technology.&quot;
//               </p>
//             </div>
//           </div>
//         </section> */}

//         <TestimonialsSection />

//         {/* CTA Section */}
//         <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at center, rgba(255,255,255,0.15) 0, transparent 60%)",
//             }}
//           />
//           <div className="relative container mx-auto px-4 text-center">
//             <h2 className="mb-6 text-4xl md:text-5xl font-heading font-bold tracking-tight">
//               Ready for Your Next Adventure?
//             </h2>
//             <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/90 font-medium">
//               Join thousands of event-goers who have discovered unforgettable experiences across Sri
//               Lanka through BookMySeat.
//             </p>
//             <Link
//               href="/register"
//               className="inline-flex h-12 md:h-14 items-center justify-center rounded-xl bg-background px-10 text-base font-semibold text-foreground transition-all hover:bg-background/90 hover:scale-[1.02] shadow-xl">
//               Create Free Account
//             </Link>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {FeaturedEvents} from "@/components/featured-events";
import {Trophy, Film, ArrowRight, CalendarDays, Users, Star} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import HeroSection from "@/components/hero";
import {GiMusicalNotes, GiPartyFlags} from "react-icons/gi";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getSession } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";

const categories = [
  {name: "Concerts", icon: GiMusicalNotes, color: "text-pink-500", bg: "bg-pink-500/10", count: 24},
  {name: "Theatre", icon: Film, color: "text-yellow-500", bg: "bg-yellow-500/10", count: 12},
  {name: "Sports", icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10", count: 18},
  {
    name: "Family & Other",
    icon: GiPartyFlags,
    color: "text-red-500",
    bg: "bg-red-500/10",
    count: 9,
  },
];

const stats = [
  {icon: CalendarDays, value: "500+", label: "Events hosted"},
  {icon: Users, value: "50k+", label: "Happy attendees"},
  {icon: Star, value: "4.9", label: "Average rating"},
];

export default async function HomePage() {
  const session = await getSession();
  if (session && isAdminRole(session.user.role)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Stats bar */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-3 divide-x divide-border">
              {stats.map(({icon: Icon, value, label}) => (
                <div key={label} className="flex flex-col items-center gap-1 px-4 text-center">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold text-foreground">{value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted/30 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
          <div className="relative container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Browse by Category
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find events that match your interests
                </p>
              </div>
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.map(category => (
                <Link
                  key={category.name}
                  href={`/events?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl shadow-sm overflow-hidden">
                  {/* subtle bg glow on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300  rounded-2xl`}
                  />

                  {/* icon with background pill */}
                  <div
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ${category.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <category.icon className={`h-7 w-7 ${category.color}`} />
                  </div>

                  <div className="relative z-10 text-center">
                    <span className="block text-sm font-semibold text-foreground">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">
                      {category.count} events
                    </span>
                  </div>

                  <ArrowRight className="absolute bottom-3 right-3 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View all events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <FeaturedEvents />

        <TestimonialsSection />

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
          {/* background pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 0, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0, transparent 40%)",
            }}
          />
          {/* decorative circles */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative container mx-auto px-4 text-center">
            <span className="inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase mb-6">
              Join BookMySeat
            </span>
            <h2 className="mb-6 text-4xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
              Ready for Your <br className="hidden sm:block" />
              Next Adventure?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/80 leading-relaxed">
              Join thousands of event-goers who have discovered unforgettable experiences across Sri
              Lanka through BookMySeat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 md:h-14 items-center justify-center rounded-xl bg-background px-10 text-base font-semibold text-foreground transition-all hover:bg-background/90 hover:scale-[1.02] shadow-xl">
                Create Free Account
              </Link>
              <Link
                href="/events"
                className="inline-flex h-12 md:h-14 items-center justify-center rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/20 gap-2">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
