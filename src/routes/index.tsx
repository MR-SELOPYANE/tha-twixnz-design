import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, Zap, Leaf } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";
import hero from "@/assets/hero-hoodie.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tha Twinz — Custom. Unique. You." },
      { name: "description", content: "Design your own premium streetwear hoodies. Bold, custom, made for the ones who stay different." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 noise" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-6">
              <Sparkles className="w-3 h-3" /> Custom Streetwear
            </span>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] mb-6">
              YOU DREAM IT.<br />
              <span className="text-gradient">WE BRING IT</span><br />
              TO LIFE.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Custom hoodies that speak your identity. Designed by you, built to outlast trends.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/customizer" className="bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-md inline-flex items-center gap-2 shadow-glow hover:opacity-90 transition">
                Design Yours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="border border-border bg-secondary/50 hover:bg-secondary px-6 py-3 rounded-md font-semibold transition">
                Shop Now
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-full" />
            <img src={hero} alt="Custom Twinz hoodie" width={1024} height={1024} className="relative w-full max-w-lg mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Palette, label: "Full Customization", sub: "Text, art, color" },
            { icon: Zap, label: "Live 3D Preview", sub: "Real-time render" },
            { icon: Sparkles, label: "AI Assistant", sub: "Describe, generate" },
            { icon: Leaf, label: "Sustainable", sub: "Water-saving fabric" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Featured Hoodies</h2>
            <p className="text-muted-foreground mt-2">This week's most loved.</p>
          </div>
          <Link to="/shop" className="text-sm text-primary hover:underline hidden sm:inline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-card border border-border p-10 sm:p-16 text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-5xl sm:text-6xl mb-4">BE YOU. NOT THEM.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Start in the customizer. Every detail is yours — fabric, fit, fonts, graphics.
            </p>
            <Link to="/customizer" className="bg-gradient-primary text-primary-foreground font-semibold px-8 py-4 rounded-md inline-flex items-center gap-2 shadow-glow">
              Open Customizer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
