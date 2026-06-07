import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/customizer", label: "Customizer" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl tracking-wider">
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-primary shadow-glow" />
          THA TWINZ
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Search"><Search className="w-5 h-5" /></button>
          <button onClick={toggle} className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/admin" className="p-2 hover:bg-secondary rounded-md transition-colors hidden sm:block" aria-label="Admin"><LayoutDashboard className="w-5 h-5" /></Link>
          <button className="p-2 hover:bg-secondary rounded-md transition-colors hidden sm:block" aria-label="Profile"><User className="w-5 h-5" /></button>
          <Link to="/cart" className="p-2 hover:bg-secondary rounded-md transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 md:hidden" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4 gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
