import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/wishlist")({ component: Wishlist });

function Wishlist() {
  const { user, loading } = useAuth();
  const { items, remove, isLoading } = useWishlist();
  const { add } = useCart();
  const router = useRouter();

  if (loading || isLoading) return <Page><div className="h-40 bg-muted animate-pulse" /></Page>;
  if (!user) return <Page><Empty title="Sign in to view your wishlist" cta="Log in" onCta={() => router.navigate({ to: "/login" })} /></Page>;
  if (!items.length) return <Page><Empty title="Your wishlist is empty" cta="Explore the collection" onCta={() => router.navigate({ to: "/shop" })} /></Page>;

  return (
    <Page>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {items.map((w) => {
          const p = w.product;
          return (
            <div key={w._id} className="group">
              <Link to="/products/$id" params={{ id: p._id }}>
                <div className="aspect-[4/5] bg-muted overflow-hidden hover-zoom">
                  <img src={p.images?.[0] || p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg">{p.name}</h3>
                  <div className="text-sm">${p.price?.toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => add.mutate({ productId: p._id })}>
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove.mutate(w._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

function Page({ children }: any) {
  return <div className="container mx-auto px-6 py-16"><h1 className="font-serif text-5xl mb-12">Wishlist</h1>{children}</div>;
}
function Empty({ title, cta, onCta }: any) {
  return <div className="text-center py-24 border border-dashed border-border"><p className="font-serif text-2xl mb-6">{title}</p><Button onClick={onCta}>{cta}</Button></div>;
}
