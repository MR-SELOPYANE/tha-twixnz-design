import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { products } from "@/lib/products";
import { Heart, MessageCircle, Trophy } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Tha Twinz" },
      { name: "description", content: "Designs from the Twinz community. Vote, remix, and get featured." },
    ],
  }),
  component: Community,
});

const designs = [
  { user: "@kayla", likes: 312 }, { user: "@thabo", likes: 287 },
  { user: "@nadia", likes: 256 }, { user: "@junior", likes: 198 },
  { user: "@zee", likes: 174 }, { user: "@max", likes: 142 },
];

function Community() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
            <Trophy className="w-3 h-3" /> Twinz Community
          </span>
          <h1 className="font-display text-5xl sm:text-6xl">DESIGNED BY YOU.</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">The best designs from our community. Vote weekly — top designs get made into real Twinz Drops.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((d, i) => {
            const p = products[i % products.length];
            return (
              <div key={i} className="bg-gradient-card border border-border rounded-xl overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt="Community design" width={768} height={768} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{d.user}</div>
                    <div className="text-xs text-muted-foreground">{p.name} remix</div>
                  </div>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-primary" /> {d.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {Math.floor(d.likes/12)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
