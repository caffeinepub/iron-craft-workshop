import { Link } from "@tanstack/react-router";
import { Hammer, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary/20 border border-primary flex items-center justify-center">
                <Hammer className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-heading text-lg font-black tracking-wider">
                  IRON CRAFT
                </div>
                <div className="font-heading text-xs font-bold text-primary tracking-widest">
                  WORKSHOP
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting premium iron doors, windows, and gates since 1998.
              Quality that stands the test of time.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="font-heading font-black text-sm tracking-widest mb-4 text-primary">
              NAVIGATION
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-heading font-black text-sm tracking-widest mb-4 text-primary">
              CONTACT
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> +1 (555) 987-6543
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" /> 42 Industrial
                Ave, Steel City, TX 75001
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> info@ironcraft.com
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
          <Link
            to="/admin"
            className="text-muted-foreground/50 hover:text-primary transition-colors text-xs"
            data-ocid="nav.link"
          >
            ADMIN PANEL
          </Link>
        </div>
      </div>
    </footer>
  );
}
