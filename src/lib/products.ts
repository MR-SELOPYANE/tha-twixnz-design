import h1 from "@/assets/hoodie-1.jpg";
import h2 from "@/assets/hoodie-2.jpg";
import h3 from "@/assets/hoodie-3.jpg";
import h4 from "@/assets/hoodie-4.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  style: "Regular" | "Oversized" | "Zip-up";
  colors: string[];
  rating: number;
  reviews: number;
  tag?: string;
  description: string;
};

export const products: Product[] = [
  { id: "twinz-signature", name: "Twinz Signature", price: 699, image: h1, style: "Regular", colors: ["#000","#fff","#7c3aed"], rating: 4.9, reviews: 128, tag: "Best Seller", description: "The original Twinz hoodie. Heavyweight 400gsm fleece, double-stitched, made to last." },
  { id: "dream-create-inspire", name: "Dream Create Inspire", price: 699, image: h2, style: "Oversized", colors: ["#000","#1a1a1a"], rating: 4.8, reviews: 94, tag: "New", description: "Bold purple typography. Oversized fit for that streetwear silhouette." },
  { id: "no-limits", name: "No Limits Hoodie", price: 699, image: h3, style: "Oversized", colors: ["#000"], rating: 4.7, reviews: 76, tag: "Limited", description: "Back-print statement piece. Made for the ones who refuse to follow." },
  { id: "stay-different", name: "Stay Different", price: 699, image: h4, style: "Zip-up", colors: ["#000","#1a1a1a"], rating: 4.9, reviews: 112, description: "Minimal zip-up with embroidered Twinz mark. Everyday essential." },
];
