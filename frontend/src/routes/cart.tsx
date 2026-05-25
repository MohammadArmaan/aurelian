import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const { user, loading } = useAuth();
  const { items, subtotal, update, remove, isLoading } = useCart();
  const router = useRouter();

  if (loading)
    return (
      <Page>
        <div className="h-40 animate-pulse bg-muted" />
      </Page>
    );
  if (!user)
    return (
      <Page>
        <Empty
          title="Sign in to view your cart"
          cta="Log in"
          onCta={() => router.navigate({ to: "/login" })}
        />
      </Page>
    );

  if (isLoading)
    return (
      <Page>
        <div className="h-40 animate-pulse bg-muted" />
      </Page>
    );
  if (!items.length)
    return (
      <Page>
        <Empty
          title="Your cart is empty"
          cta="Browse the collection"
          onCta={() => router.navigate({ to: "/shop" })}
        />
      </Page>
    );

  return (
    <Page>
      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-6">
          {items.map((item) => {
            const p = item.product;
            const img = p.images?.[0] || p.image || "";
            return (
              <div
                key={item._id}
                className="grid grid-cols-[120px_1fr_auto] gap-6 border-b border-border pb-6"
              >
                <Link
                  to="/products/$id"
                  params={{ id: p._id }}
                  className="aspect-square bg-muted overflow-hidden"
                >
                  <img src={img} alt={p.name} className="h-full w-full object-cover" />
                </Link>
                <div>
                  <h3 className="font-serif text-xl">{p.name}</h3>
                  {p.material && (
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                      {p.material}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 border border-border w-fit">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={item.quantity <= 1}
                      onClick={() => update.mutate({ id: item._id, quantity: item.quantity - 1 })}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => update.mutate({ id: item._id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-xl">
                    ${(p.price * item.quantity).toLocaleString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => remove.mutate(item._id)}
                  >
                    <X className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <aside className="bg-card p-8 h-fit sticky top-32 border border-border">
          <h2 className="font-serif text-2xl mb-6">Summary</h2>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
            <Row label="Shipping" value="Calculated at checkout" />
          </div>
          <div className="border-t border-border my-6" />
          <Row label="Total" value={`$${subtotal.toLocaleString()}`} large />
          <Button
            className="w-full mt-8"
            size="lg"
            onClick={() => router.navigate({ to: "/checkout" })}
          >
            Proceed to checkout
          </Button>
        </aside>
      </div>
    </Page>
  );
}

function Row({ label, value, large }: any) {
  return (
    <div className={`flex justify-between ${large ? "font-serif text-xl" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
function Page({ children }: any) {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl mb-12">Your cart</h1>
      {children}
    </div>
  );
}
function Empty({ title, cta, onCta }: any) {
  return (
    <div className="text-center py-24 border border-dashed border-border">
      <p className="font-serif text-2xl mb-6">{title}</p>
      <Button onClick={onCta}>{cta}</Button>
    </div>
  );
}
