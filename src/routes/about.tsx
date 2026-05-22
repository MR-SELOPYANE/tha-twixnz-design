import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Leaf, Heart, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Twinz" },
      { name: "description", content: "The Twinz is a custom streetwear platform built for self-expression and sustainability." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="relative bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-6xl sm:text-7xl">CUSTOM. UNIQUE. <span className="text-gradient">YOU.</span></h1>
          <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
            The Twinz was built for the ones who refuse to look like everyone else.
            A studio in your pocket. A platform built for self-expression, made in Africa, shipped worldwide.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Heart, title: "Made for self-expression", body: "Every Twinz hoodie is custom. No two are the same. That's the point." },
          { icon: Leaf, title: "Built to last", body: "Heavyweight fabric, double-stitched seams, and water-saving production." },
          { icon: Globe, title: "Africa to the world", body: "Designed and printed in Johannesburg. Worn in 12+ countries." },
        ].map(v => (
          <div key={v.title} className="bg-gradient-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 grid place-items-center text-primary mb-4">
              <v.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
