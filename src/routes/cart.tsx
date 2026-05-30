import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { products } from "@/lib/products";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Tha Twinz" }] }),
  component: Cart,
});

function Cart() {
  const [items, setItems] = useState(
    products.slice(0, 2).map(p => ({ ...p, qty: 1, size: "M" }))
  );
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 80;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-5xl mb-8">CART</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Your cart is empty. <Link to="/shop" className="text-primary">Shop now</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-4">
              {items.map((it, idx) => (
                <div key={it.id} className="bg-gradient-card border border-border rounded-xl p-4 flex gap-4">
                  <img src={it.image} alt={it.name} width={120} height={120} className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{it.name}</h3>
                        <p className="text-xs text-muted-foreground">{it.style} · Size {it.size}</p>
                      </div>
                      <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-md">
                        <button className="p-2" onClick={() => setItems(items.map((x,i) => i===idx ? {...x, qty: Math.max(1, x.qty-1)} : x))}><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm">{it.qty}</span>
                        <button className="p-2" onClick={() => setItems(items.map((x,i) => i===idx ? {...x, qty: x.qty+1} : x))}><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-display text-xl">R{it.price * it.qty}.00</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-card border border-border rounded-xl p-6 h-fit">
              <h3 className="font-display text-2xl mb-4">SUMMARY</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R{subtotal}.00</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : `R${shipping}.00`}</span></div>
                <div className="flex justify-between pt-3 border-t border-border font-display text-xl"><span>Total</span><span>R{subtotal + shipping}.00</span></div>
              </div>
              <Link to="/checkout" className="block text-center bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-md mt-6 shadow-glow">Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
