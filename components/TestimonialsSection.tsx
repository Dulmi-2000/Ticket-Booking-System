"use client";
import {useState, useEffect} from "react";

const testimonials = [
  {
    quote:
      "BookMySeat is one of the fast-growing ticket marketplaces that includes events of music, sport, art, theatre, and more in Sri Lanka. It is capable to accommodate events of all types, sizes, and complexities with the state-of-the-art technology.",
    author: "Ashan Perera",
    role: "Event Organizer, Colombo",
  },
  {
    quote:
      "I booked tickets for a live concert through BookMySeat and the whole experience was seamless. From browsing to payment to getting the e-ticket — everything was smooth and fast. Highly recommend it!",
    author: "Dilnoza Fernando",
    role: "Music Fan, Kandy",
  },
  {
    quote:
      "As a theatre group, we've used BookMySeat to sell tickets for our last three productions. The platform handles everything effortlessly and our audience loves how easy it is to book seats online.",
    author: "Ruchira Jayawardena",
    role: "Theatre Director, Galle",
  },
  {
    quote:
      "Finding events in Sri Lanka used to be a hassle. Now I just open BookMySeat, filter by category, and I'm done in minutes. It's become my go-to for discovering what's happening around me.",
    author: "Nimal Bandara",
    role: "Sports Enthusiast, Negombo",
  },
  {
    quote:
      "The customer support team resolved my booking issue within hours. I've never felt more confident using an online ticketing platform. BookMySeat truly puts the customer first.",
    author: "Sanduni Wickramasinghe",
    role: "Regular Attendee, Colombo",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (n: number) => setCurrent((n + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 border-t border-border bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="mb-8 text-3xl font-heading font-bold text-foreground">What People Say</h2>
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

          <div className="transition-all duration-500">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic font-medium mb-6">
              &quot;{testimonials[current].quote}&quot;
            </p>
            <p className="font-semibold text-foreground">{testimonials[current].author}</p>
            <p className="text-sm text-muted-foreground mt-1">{testimonials[current].role}</p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => goTo(current - 1)}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            &#8592;
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}
