import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop THA TWINZ Hoodies" },
      { name: "description", content: "Shop custom-ready THA TWINZ hoodies in oversized, regular, and zip-up fits." },
      { property: "og:title", content: "Shop THA TWINZ Hoodies" },
      { property: "og:description", content: "Explore custom-ready streetwear hoodies in standout fits and styles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [style, setStyle] = useState<string>("All");
  const [sort, setSort] = useState<string>("featured");

  const styles = ["All", "Regular", "Oversized", "Zip-up"];
  let filtered = style === "All" ? products : products.filter(p => p.style === style);
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display text-5xl sm:text-6xl">SHOP</h1>
          <p className="text-muted-foreground mt-2">All hoodies. All custom-ready.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-border pb-4">
          <div className="flex gap-2 flex-wrap">
            {styles.map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-md text-sm transition ${style === s ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-input border border-border rounded-md px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
        </div>
      </div>
    </Layout>
  );
}
