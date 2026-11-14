import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useState } from "react";
import { products as seedProducts } from "@/lib/products";
import { Check, X, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Store Admin — THA TWINZ" },
      { name: "description", content: "Manage THA TWINZ products, order statuses, and community design reviews." },
      { property: "og:title", content: "Store Admin — THA TWINZ" },
      { property: "og:description", content: "Manage store products, orders, and community submissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type Order = { id: string; customer: string; total: number; status: "Pending" | "Shipped" | "Delivered" };
type Design = { id: string; author: string; title: string; status: "Pending" | "Approved" | "Rejected" };

const seedOrders: Order[] = [
  { id: "TW-1042", customer: "Sipho M.", total: 1499, status: "Pending" },
  { id: "TW-1041", customer: "Lerato K.", total: 799, status: "Shipped" },
  { id: "TW-1040", customer: "Andile N.", total: 2199, status: "Delivered" },
];
const seedDesigns: Design[] = [
  { id: "d1", author: "@kayo", title: "Neon Skyline", status: "Pending" },
  { id: "d2", author: "@msz", title: "Pixel Lion", status: "Pending" },
  { id: "d3", author: "@thabo", title: "Static Dreams", status: "Approved" },
];

function AdminPage() {
  const [tab, setTab] = useState<"products" | "orders" | "designs">("products");
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState(seedOrders);
  const [designs, setDesigns] = useState(seedDesigns);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-display text-5xl">ADMIN</h1>
            <p className="text-sm text-muted-foreground">Manage your store, orders and community submissions.</p>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to store</Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Stat label="Products" value={products.length} />
          <Stat label="Pending orders" value={orders.filter((o) => o.status === "Pending").length} />
          <Stat label="Designs to review" value={designs.filter((d) => d.status === "Pending").length} />
        </div>

        <div className="flex gap-2 border-b border-border mb-6">
          {(["products", "orders", "designs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize border-b-2 -mb-px ${
                tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="font-semibold">Products</h2>
              <button
                onClick={() =>
                  setProducts([
                    ...products,
                    {
                      id: `new-${Date.now()}`,
                      name: "New Hoodie",
                      price: 699,
                      image: products[0].image,
                      style: "Regular",
                      colors: ["#000"],
                      rating: 5,
                      reviews: 0,
                      description: "New product.",
                    },
                  ])
                }
                className="text-xs flex items-center gap-1 bg-gradient-primary text-primary-foreground px-3 py-1.5 rounded"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground bg-secondary">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-right p-3">Price</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.style}</td>
                    <td className="p-3 text-right">R{p.price}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setProducts(products.filter((x) => x.id !== p.id))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground bg-secondary">
                <tr>
                  <th className="text-left p-3">Order</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-right p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-3 font-mono">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3 text-right">R{o.total}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          setOrders(orders.map((x) => (x.id === o.id ? { ...x, status: e.target.value as Order["status"] } : x)))
                        }
                        className="bg-input border border-border rounded px-2 py-1 text-xs"
                      >
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "designs" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.map((d) => (
              <div key={d.id} className="bg-card border border-border rounded-xl p-4">
                <div className="aspect-square bg-gradient-primary opacity-30 rounded-lg mb-3" />
                <h3 className="font-semibold">{d.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">by {d.author}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                      d.status === "Approved"
                        ? "bg-primary/20 text-primary"
                        : d.status === "Rejected"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.status}
                  </span>
                  {d.status === "Pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDesigns(designs.map((x) => (x.id === d.id ? { ...x, status: "Approved" } : x)))}
                        className="p-1.5 bg-primary/10 text-primary rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDesigns(designs.map((x) => (x.id === d.id ? { ...x, status: "Rejected" } : x)))}
                        className="p-1.5 bg-destructive/10 text-destructive rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-5">
      <p className="text-xs uppercase text-muted-foreground tracking-wider">{label}</p>
      <p className="font-display text-4xl mt-2">{value}</p>
    </div>
  );
}
