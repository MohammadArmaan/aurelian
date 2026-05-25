import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@tanstack/react-router";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { add: addWish } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const img = product.images?.[0] || product.image || `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80`;

  const requireAuth = (fn: () => void) => () => {
    if (!user) return router.navigate({ to: "/login" });
    fn();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to="/products/$id" params={{ id: product._id }}>
        <div className="hover-zoom relative aspect-[4/5] overflow-hidden bg-muted">
          <img src={img} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <Button
              size="icon" variant="secondary" className="glass border-0 rounded-full h-10 w-10"
              onClick={(e) => { e.preventDefault(); requireAuth(() => addWish.mutate(product._id))(); }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon" variant="secondary" className="glass border-0 rounded-full h-10 w-10"
              onClick={(e) => { e.preventDefault(); requireAuth(() => add.mutate({ productId: product._id }))(); }}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
          {product.material && <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{product.material}</p>}
        </div>
        <div className="text-right">
          <div className="font-serif text-lg">${product.price?.toLocaleString()}</div>
          {product.rating != null && (
            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
              <Star className="h-3 w-3 fill-current text-accent" /> {product.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/5] bg-muted animate-pulse" />
      <div className="mt-4 h-4 w-3/4 bg-muted animate-pulse" />
      <div className="mt-2 h-3 w-1/3 bg-muted animate-pulse" />
    </div>
  );
}
