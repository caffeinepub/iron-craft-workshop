import { Link, useLocation } from "@tanstack/react-router";
import { Hammer, Menu, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "PRODUCTS", to: "/products" },
  { label: "ABOUT", to: "/#about" },
  { label: "CONTACT", to: "/contact" },
];

export default function Header() {
  const { identity } = useInternetIdentity();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return (
      location.pathname.startsWith(to.split("#")[0]) && to.split("#")[0] !== "/"
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-10 h-10 rounded bg-primary/20 border border-primary flex items-center justify-center">
            <Hammer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-heading text-xl font-black text-foreground tracking-wider leading-none">
              IRON CRAFT
            </div>
            <div className="font-heading text-xs font-bold text-primary tracking-widest">
              WORKSHOP
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-heading font-bold text-sm tracking-widest transition-colors ${isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/contact" data-ocid="nav.primary_button">
            <button
              type="button"
              className="font-heading font-black text-sm tracking-wider bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-colors uppercase"
            >
              GET A QUOTE
            </button>
          </Link>
          {identity && (
            <Link to="/admin" data-ocid="nav.link">
              <UserCircle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-heading font-bold text-sm tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.primary_button"
          >
            <button
              type="button"
              className="font-heading font-black text-sm tracking-wider bg-primary text-primary-foreground px-5 py-2 w-full uppercase"
            >
              GET A QUOTE
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
