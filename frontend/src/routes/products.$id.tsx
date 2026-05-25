import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingBag, Star, Ruler, Hammer } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/lib/auth-context";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({ component: PDP });

function PDP() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { add: addCart } = useCart();
  const { add: addWish } = useWishlist();
  const qc = useQueryClient();
  const [activeImg, setActiveImg] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [inquiry, setInquiry] = useState({ company: "", message: "" });

  const product = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
  });

  const reviews = useQuery<any[]>({
    queryKey: ["reviews", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/reviews/product/${id}`);
        return Array.isArray(data) ? data : data.reviews || [];
      } catch { return []; }
    },
  });

  const related = useQuery<Product[]>({
    queryKey: ["products", "related"],
    queryFn: async () => {
      try { const { data } = await api.get("/products"); return (Array.isArray(data) ? data : data.products || []).slice(0, 4); }
      catch { return []; }
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => (await api.post("/reviews", { productId: id, rating: reviewRating, comment: reviewBody })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reviews", id] }); setReviewBody(""); toast.success("Review submitted"); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not submit review"),
  });

  const submitInquiry = useMutation({
    mutationFn: async () => (await api.post("/bookings", { productId: id, type: "contractor_inquiry", ...inquiry })).data,
    onSuccess: () => { toast.success("Inquiry sent. We'll respond within 48 hours."); setInquiry({ company: "", message: "" }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not send inquiry"),
  });

  if (product.isLoading) return <div className="container mx-auto px-6 py-24"><div className="h-[60vh] bg-muted animate-pulse" /></div>;
  if (!product.data) return <div className="container mx-auto px-6 py-24 text-center">Product not found.</div>;

  const p = product.data;
  const images = p.images?.length ? p.images : [p.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80"];
  const requireAuth = (fn: () => void) => () => { if (!user) return router.navigate({ to: "/login" }); fn(); };

  return (
    <div>
      <div className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div>
          <motion.div layoutId={`img-${activeImg}`} className="aspect-square bg-muted overflow-hidden editorial-shadow group">
            <img src={images[activeImg]} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
          </motion.div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {images.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden border-2 ${i === activeImg ? "border-accent" : "border-transparent"}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {typeof p.category === "object" ? p.category?.name : p.category || "Aurelian"}
          </p>
          <h1 className="font-serif text-5xl leading-tight">{p.name}</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="font-serif text-3xl">${p.price?.toLocaleString()}</div>
            {p.rating != null && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-accent" />
                {p.rating.toFixed(1)} ({p.numReviews ?? 0})
              </div>
            )}
          </div>
          <p className="mt-8 leading-relaxed text-muted-foreground">{p.description || "A timeless piece, made by hand in our atelier."}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {p.material && <Spec icon={Hammer} label="Material" value={p.material} />}
            {p.dimensions && <Spec icon={Ruler} label="Dimensions" value={`${p.dimensions.width ?? "—"}W × ${p.dimensions.height ?? "—"}H × ${p.dimensions.depth ?? "—"}D cm`} />}
          </div>

          <div className="flex gap-3 mt-10">
            <Button size="lg" className="flex-1" onClick={requireAuth(() => addCart.mutate({ productId: p._id }))} disabled={addCart.isPending}>
              <ShoppingBag className="h-4 w-4" /> {addCart.isPending ? "Adding…" : "Add to cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={requireAuth(() => addWish.mutate(p._id))}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="reviews" className="mt-12">
            <TabsList>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="contractor">Contractor inquiry</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-6 pt-6">
              {user && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setReviewRating(n)}>
                        <Star className={`h-5 w-5 ${n <= reviewRating ? "fill-current text-accent" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} placeholder="Share your thoughts" />
                  <Button onClick={() => submitReview.mutate()} disabled={!reviewBody || submitReview.isPending}>
                    {submitReview.isPending ? "Submitting…" : "Submit review"}
                  </Button>
                </div>
              )}
              {reviews.data?.length ? reviews.data.map((r: any) => (
                <div key={r._id} className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    <strong className="font-serif">{r.user?.name || "Guest"}</strong>
                    <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current text-accent" />)}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </div>
              )) : <p className="text-muted-foreground text-sm">No reviews yet.</p>}
            </TabsContent>
            <TabsContent value="contractor" className="space-y-3 pt-6">
              <p className="text-sm text-muted-foreground">Specifying this piece for a project? Send us a brief.</p>
              <Input placeholder="Studio / company" value={inquiry.company} onChange={(e) => setInquiry({ ...inquiry, company: e.target.value })} />
              <Textarea placeholder="Quantity, finish requests, lead time…" value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} />
              <Button onClick={requireAuth(() => submitInquiry.mutate())} disabled={submitInquiry.isPending}>
                {submitInquiry.isPending ? "Sending…" : "Request a quote"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="font-serif text-3xl mb-12">You may also love</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {related.data?.filter((r) => r._id !== id).slice(0, 4).map((r) => <ProductCard key={r._id} product={r} />)}
        </div>
      </section>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 p-4 border border-border">
      <Icon className="h-4 w-4 mt-0.5 text-accent" />
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-1">{value}</div>
      </div>
    </div>
  );
}
