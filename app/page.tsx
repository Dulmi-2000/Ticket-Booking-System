import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {FeaturedEvents} from "@/components/featured-events";
import {Music, Trophy, Film, Utensils} from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/hero";
import {GiMusicalNotes} from "react-icons/gi";
import TestimonialsSection from "@/components/TestimonialsSection";

const categories = [
  {name: "Concerts", icon: GiMusicalNotes, color: "text-pink-500"},
  {name: "Theatre", icon: Film, color: "text-blue-500"},
  {name: "Sports", icon: Trophy, color: "text-orange-500"},
  {name: "Food & Drink", icon: Utensils, color: "text-red-500"},
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Categories Section */}
        <section className="bg-muted/30 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
          <div className="relative container mx-auto px-4">
            <h2 className="mb-10 text-center text-3xl font-heading font-bold text-foreground">
              Browse by Category
            </h2>
            <div>
              <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-4 ">
                {categories.map(category => (
                  <Link
                    key={category.name}
                    href={`/events?category=${encodeURIComponent(category.name)}`}
                    className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl shadow-sm">
                    <category.icon
                      className={`h-10 w-10 ${category.color} transition-transform duration-300 group-hover:scale-110`}
                    />
                    <span className="text-sm font-semibold text-foreground">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FeaturedEvents />

        {/* What People Say Section */}
        {/* <section className="py-20 border-t border-border bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-heading font-bold text-foreground">
              What People Say
            </h2>
            <div className="relative p-10 md:p-14 rounded-3xl bg-card border border-border shadow-2xl pt-14">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic font-medium">
                &quot;BookMySeat is one of the fast-growing ticket marketplaces that includes events
                of music, sport, art, theatre, and more in Sri Lanka. It is capable to accommodate
                events of all types, sizes, and complexities with the state-of-the-art
                technology.&quot;
              </p>
            </div>
          </div>
        </section> */}

        <TestimonialsSection />

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(255,255,255,0.15) 0, transparent 60%)",
            }}
          />
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="mb-6 text-4xl md:text-5xl font-heading font-bold tracking-tight">
              Ready for Your Next Adventure?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/90 font-medium">
              Join thousands of event-goers who have discovered unforgettable experiences across Sri
              Lanka through BookMySeat.
            </p>
            <Link
              href="/register"
              className="inline-flex h-12 md:h-14 items-center justify-center rounded-xl bg-background px-10 text-base font-semibold text-foreground transition-all hover:bg-background/90 hover:scale-[1.02] shadow-xl">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
