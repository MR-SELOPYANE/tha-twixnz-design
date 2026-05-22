import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { products } from "@/lib/products";
import { Star, Truck, Shield, RotateCcw, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = products.find(p => p.id === params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — The Twinz` : "Product" },
      { name: "description", content: loaderData?.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <Layout><div className="py-32 text-center text-muted-foreground">Product not found</div></Layout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(p.colors[0]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">← Back to shop</Link>
        <div className="grid lg:grid-cols-2 gap-10 mt-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-card border border-border rounded-2xl overflow-hidden">
            <img src={p.image} alt={p.name} width={768} height={768} className="w-full aspect-square object-cover" />
          </motion.div>
          <div>
            {p.tag && <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded">{p.tag}</span>}
            <h1 className="font-display text-5xl mt-3">{p.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" /> {p.rating}</span>
              <span>·</span>
              <span>{p.reviews} reviews</span>
              <span>·</span>
              <span>{p.style}</span>
            </div>
            <div className="font-display text-4xl mt-6">R{p.price}.00</div>
            <p className="text-muted-foreground mt-4">{p.description}</p>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</div>
              <div className="flex gap-2">
                {p.colors.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`w-9 h-9 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Size</div>
              <div className="flex gap-2">
                {["XS","S","M","L","XL","XXL"].map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`w-12 h-10 rounded-md border text-sm transition ${size === s ? "bg-gradient-primary text-primary-foreground border-transparent" : "border-border hover:border-primary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-md shadow-glow">Add to Cart</button>
              <button className="w-14 h-14 grid place-items-center border border-border rounded-md hover:bg-secondary"><Heart className="w-5 h-5" /></button>
            </div>
            <Link to="/customizer" className="block text-center mt-3 text-sm text-primary hover:underline">Customize this hoodie →</Link>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Free SA delivery</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Secure checkout</div>
              <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-primary" /> 30-day returns</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
