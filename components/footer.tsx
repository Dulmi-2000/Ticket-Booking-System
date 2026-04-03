// import Link from "next/link";
// import {Ticket, Phone, MapPin, Mail} from "lucide-react";

// export function Footer() {
//   return (
//     <footer className="border-t border-border bg-muted/10">
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid gap-12 md:grid-cols-4 lg:gap-8">
//           <div className="space-y-4">
//             <Link href="/" className="flex items-center gap-2 mb-6">
//               <Ticket className="h-8 w-8 text-primary" />
//               <span className="text-2xl font-bold text-primary font-heading tracking-tight">
//                 BookMySeat
//               </span>
//             </Link>
//             <p className="text-sm text-muted-foreground leading-relaxed">
//               BookMySeat is one of the fast-growing ticket marketplaces that includes events of
//               music, sport, art, theatre, and more in Sri Lanka.
//             </p>
//           </div>

//           <div>
//             <h3 className="mb-6 text-lg font-bold text-foreground font-heading">Site Map</h3>
//             <ul className="space-y-3 text-sm text-muted-foreground font-medium">
//               <li>
//                 <Link
//                   href="/events?category=Concerts"
//                   className="hover:text-primary transition-colors">
//                   Concerts
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/events?category=Theatre"
//                   className="hover:text-primary transition-colors">
//                   Theatre
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/download-tickets" className="hover:text-primary transition-colors">
//                   Download Tickets
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/about-us" className="hover:text-primary transition-colors">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="hover:text-primary transition-colors">
//                   Contact
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/login" className="hover:text-primary transition-colors">
//                   Login
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="mb-6 text-lg font-bold text-foreground font-heading">FAQ</h3>
//             <ul className="space-y-3 text-sm text-muted-foreground font-medium">
//               <li>
//                 <Link href="/privacy-policy" className="hover:text-primary transition-colors">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
//                   Terms & conditions
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="mb-6 text-lg font-bold text-foreground font-heading">Contact</h3>
//             <ul className="space-y-4 text-sm text-muted-foreground font-medium">
//               <li className="flex items-start gap-3">
//                 <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                 <div className="flex flex-col gap-1">
//                   <a href="tel:+94777666666" className="hover:text-primary transition-colors">
//                     +94777666666
//                   </a>
//                   <a href="tel:+94777999999" className="hover:text-primary transition-colors">
//                     +94777999999
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                 <a
//                   href="https://maps.app.goo.gl/Y1dNx5S35hD5LrPJA"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="hover:text-primary transition-colors leading-relaxed">
//                   No 261/A/3/5,
//                   <br /> Main Street,
//                   <br /> Colombo
//                 </a>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail className="h-5 w-5 text-primary shrink-0" />
//                 <a
//                   href="mailto:hello@bookmyseat.com"
//                   className="hover:text-primary transition-colors">
//                   hello@bookmyseat.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground font-medium gap-4">
//           <p>&copy; {new Date().getFullYear()} BookMySeat.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import {Ticket, Phone, MapPin, Mail} from "lucide-react";
import {FaFacebookF, FaInstagram, FaTwitter} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Ticket className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary font-heading tracking-tight">
                BookMySeat
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Discover and book tickets for concerts, theatre, sports, and more across Sri Lanka.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a className="p-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition">
                <FaFacebookF size={14} />
              </a>

              <a className="p-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition">
                <FaInstagram size={14} />
              </a>

              <a className="p-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition">
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-foreground font-heading">Site Map</h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              {[
                {name: "Concerts", link: "/events?category=Concerts"},
                {name: "Theatre", link: "/events?category=Theatre"},
                {name: "Download Tickets", link: "/download-tickets"},
                {name: "About Us", link: "/about-us"},
                {name: "Contact", link: "/contact"},
                {name: "Login", link: "/login"},
              ].map(item => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-foreground font-heading">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-primary transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-foreground font-heading">Contact</h3>

            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div className="flex flex-col">
                  <a href="tel:+94777666666" className="hover:text-primary">
                    +94 777 666 666
                  </a>
                  <a href="tel:+94777999999" className="hover:text-primary">
                    +94 777 999 999
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <a
                  href="https://maps.app.goo.gl/Y1dNx5S35hD5LrPJA"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary leading-relaxed">
                  No 261/A/3/5, <br />
                  Main Street, <br />
                  Colombo
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:hello@bookmyseat.com" className="hover:text-primary">
                  hello@bookmyseat.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-3">
          <p>&copy; {new Date().getFullYear()} BookMySeat. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
