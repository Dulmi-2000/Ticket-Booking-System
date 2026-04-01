"use client";

import {motion} from "framer-motion";
import {CalendarDays, MapPin, ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// Sample event images imported from /public/images
import heroEvent from "../assets/hero-event.jpg";
import jazzEvent from "../assets/event-jazz.jpg";
import galleryEvent from "../assets/event-gallery.jpg";
import foodEvent from "../assets/event-food.jpg";
import techEvent from "../assets/event-tech.jpg";
import rooftopEvent from "../assets/event-rooftop.jpg";

// Types
export type TicketTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  image: string | StaticImageData;
  description: string;
  featured?: boolean;
  tickets: TicketTier[];
};

// Events data
const events: Event[] = [
  {
    id: "1",
    title: "Neon Pulse Festival",
    date: "Apr 18, 2026",
    time: "9:00 PM",
    venue: "Warehouse District",
    city: "Los Angeles",
    category: "Music",
    image: heroEvent,
    featured: true,
    description:
      "A multi-stage electronic music experience featuring world-class DJs, immersive light installations, and cutting-edge sound design. Three stages, twelve hours, one unforgettable night.",
    tickets: [
      {
        id: "t1",
        name: "General Admission",
        price: 65,
        description: "Full venue access",
        available: 240,
      },
      {
        id: "t2",
        name: "VIP",
        price: 150,
        description: "Priority entry, VIP lounge, complimentary drinks",
        available: 60,
      },
      {
        id: "t3",
        name: "Backstage Pass",
        price: 350,
        description: "All VIP perks + artist meet & greet",
        available: 15,
      },
    ],
  },
  {
    id: "2",
    title: "Blue Note Sessions",
    date: "Apr 25, 2026",
    time: "8:00 PM",
    venue: "The Velvet Room",
    city: "New York",
    category: "Music",
    image: jazzEvent,
    description:
      "An intimate evening of jazz featuring the Marcus Cole Quartet. Expect soulful improvisations in a candlelit setting with craft cocktails.",
    tickets: [
      {id: "t4", name: "Standard Seat", price: 45, description: "Table seating", available: 80},
      {
        id: "t5",
        name: "Front Row",
        price: 85,
        description: "Premium front-row table with welcome drink",
        available: 20,
      },
    ],
  },
  {
    id: "3",
    title: "Parallax: New Perspectives",
    date: "May 2, 2026",
    time: "6:00 PM",
    venue: "MOCA Downtown",
    city: "Chicago",
    category: "Art",
    image: galleryEvent,
    description:
      "Opening night of a groundbreaking exhibition exploring the intersection of digital art and physical space. Features 14 international artists.",
    tickets: [
      {
        id: "t6",
        name: "Opening Night",
        price: 35,
        description: "Exhibition access + reception",
        available: 150,
      },
      {
        id: "t7",
        name: "Collector Preview",
        price: 120,
        description: "Early access + artist talk + catalog",
        available: 30,
      },
    ],
  },
  {
    id: "4",
    title: "Street Feast Market",
    date: "May 10, 2026",
    time: "4:00 PM",
    venue: "Riverside Park",
    city: "Austin",
    category: "Food & Drink",
    image: foodEvent,
    description:
      "Austin's biggest outdoor food festival returns with 40+ vendors, live music, craft beer gardens, and cooking demos from top local chefs.",
    tickets: [
      {id: "t8", name: "General Entry", price: 15, description: "Festival access", available: 500},
      {
        id: "t9",
        name: "Tasting Pass",
        price: 55,
        description: "10 tasting tokens + festival access",
        available: 200,
      },
    ],
  },
  {
    id: "5",
    title: "Future Forward Summit",
    date: "May 16, 2026",
    time: "9:00 AM",
    venue: "Convention Center",
    city: "San Francisco",
    category: "Tech",
    image: techEvent,
    description:
      "A two-day conference on AI, climate tech, and the future of work. Keynotes from industry leaders, hands-on workshops, and startup showcase.",
    tickets: [
      {id: "t10", name: "Day Pass", price: 199, description: "Single day access", available: 300},
      {
        id: "t11",
        name: "Full Conference",
        price: 349,
        description: "Both days + workshops + recordings",
        available: 200,
      },
      {
        id: "t12",
        name: "Executive",
        price: 799,
        description: "All access + private networking dinner",
        available: 40,
      },
    ],
  },
  {
    id: "6",
    title: "Skyline After Dark",
    date: "May 23, 2026",
    time: "10:00 PM",
    venue: "The Apex Rooftop",
    city: "Miami",
    category: "Nightlife",
    image: rooftopEvent,
    description:
      "An exclusive rooftop experience above the Miami skyline. World-class DJs, open bar, and panoramic views of the bay.",
    tickets: [
      {id: "t13", name: "Standard", price: 75, description: "Entry + 2 drinks", available: 150},
      {
        id: "t14",
        name: "Table Service",
        price: 500,
        description: "Reserved table for 4, bottle service",
        available: 10,
      },
    ],
  },
];

const HeroSection = () => {
  const featured = events.find(e => e.featured)!;
  const router = useRouter();

  return (
    <section className="relative h-[40vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={featured.image} alt={featured.title} fill priority className="object-cover" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" /> */}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pb-20">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: "easeOut"}}
          className="max-w-2xl rounded-2xl bg-background/10 p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <span className="relative inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6 shadow-sm">
            Welcome to BookMySeat
          </span>

          <h1 className="relative font-heading text-5xl md:text-7xl font-bold text-white leading-[0.95] mb-5">
            Let’s Book Your Event
          </h1>

          <p className="relative text-white/60 text-lg mb-8 max-w-lg leading-relaxed">
            Book live events and discover concerts, sports, theater and more across Sri Lanka.
          </p>

          <div className="relative flex flex-wrap gap-3 mt-8">
            <Link href="/events?category=Concerts" className="px-5 py-2.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:border-primary transition-all shadow-sm">
              Concerts
            </Link>
            <Link href="/events?category=Sports" className="px-5 py-2.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:border-primary transition-all shadow-sm">
              Sports
            </Link>
            <Link href="/events?category=Movies" className="px-5 py-2.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:border-primary transition-all shadow-sm">
              Movies
            </Link>
            <Link href="/events?category=Drama" className="px-5 py-2.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:border-primary transition-all shadow-sm">
              Drama
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
