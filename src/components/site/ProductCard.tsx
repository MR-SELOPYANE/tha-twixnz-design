import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product, i = 0 }: { product: Product; i?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="group block bg-gradient-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-glow"
      >
        <div className="aspect-square overflow-hidden bg-background relative">
          {product.tag && (
            <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded">
              {product.tag}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={768}
            height={768}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-foreground font-display text-xl">R{product.price}.00</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-primary text-primary" /> {product.rating}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
