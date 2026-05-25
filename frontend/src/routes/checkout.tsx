import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const { user, loading } = useAuth();
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [addr, setAddr] = useState({
    fullName: user?.name || "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  if (loading) return null;
  if (!user) {
    router.navigate({ to: "/login" });
    return null;
  }

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const { data } = await api.get(`/coupons/${coupon}`);
      const pct = data.discount ?? data.percentage ?? 0;
      setDiscount(Math.round(subtotal * (pct / 100)));
      toast.success(`Coupon applied: ${pct}% off`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Invalid coupon");
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const shippingPayload = {
        label: addr.fullName,
        street: addr.line1,
        city: addr.city,
        postalCode: addr.postalCode,
        country: addr.country,
      };
      const orderItems = items.map((i) => ({
        product: i.product._id,
        title: i.product.name || i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image || i.product.images?.[0] || "",
      }));
      const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingPrice = 49;
      const taxPrice = 0;
      const totalPrice = itemsPrice - discount + shippingPrice;

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: shippingPayload,
        paymentMethod: "Stripe",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode: coupon || undefined,
      });
      toast.success("Order placed");
      router.navigate({ to: "/orders" });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl mb-12">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            placeOrder();
          }}
          className="space-y-6"
        >
          <h2 className="font-serif text-2xl">Shipping</h2>
          <Field label="Full name">
            <Input
              required
              value={addr.fullName}
              onChange={(e) => setAddr({ ...addr, fullName: e.target.value })}
            />
          </Field>
          <Field label="Address">
            <Input
              required
              value={addr.line1}
              onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="City">
              <Input
                required
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
              />
            </Field>
            <Field label="Postal code">
              <Input
                required
                value={addr.postalCode}
                onChange={(e) => setAddr({ ...addr, postalCode: e.target.value })}
              />
            </Field>
            <Field label="Country">
              <Input
                required
                value={addr.country}
                onChange={(e) => setAddr({ ...addr, country: e.target.value })}
              />
            </Field>
          </div>
        </form>
        <aside className="bg-card border border-border p-8 h-fit">
          <h2 className="font-serif text-2xl mb-6">Order summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span>
                  {i.product.name} × {i.quantity}
                </span>
                <span>${(i.product.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t my-4" />
          <div className="flex gap-2">
            <Input
              placeholder="Coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          <div className="border-t my-4" />
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
            {discount > 0 && <Row label="Discount" value={`-$${discount.toLocaleString()}`} />}
            <Row label="Total" value={`$${(subtotal - discount).toLocaleString()}`} large />
          </div>
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={placeOrder}
            disabled={placing || !items.length}
          >
            {placing ? "Placing order…" : "Place order"}
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <Label className="mb-2 block text-xs uppercase tracking-widest">{label}</Label>
      {children}
    </div>
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
