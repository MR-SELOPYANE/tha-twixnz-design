import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-wider mb-3">THE TWINZ</div>
          <p className="text-sm text-muted-foreground">Custom streetwear. Designed by you, built to last.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">All Hoodies</Link></li>
            <li><Link to="/customizer">Customizer</Link></li>
            <li><Link to="/community">Twinz Drops</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Stay in the loop</h4>
          <p className="text-sm text-muted-foreground mb-3">Drops, designs, and discounts.</p>
          <form className="flex gap-2">
            <input type="email" placeholder="you@email.com" className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm" />
            <button className="bg-gradient-primary text-primary-foreground rounded-md px-4 text-sm font-semibold">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} The Twinz. All rights reserved.
      </div>
    </footer>
  );
}
