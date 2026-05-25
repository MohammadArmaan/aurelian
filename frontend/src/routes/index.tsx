import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api, type Product } from "@/lib/api";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Award, Hammer, Truck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

const HERO = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2400&q=80";
const INTERIORS = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1800&q=80";
const CONTRACTOR = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1800&q=80";

function Home() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const featured = useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/products/featured");
        return Array.isArray(data) ? data : data.products || [];
      } catch { return []; }
    },
  });

  const bestSellers = useQuery<Product[]>({
    queryKey: ["products", "best"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/products", { params: { sort: "-rating", limit: 8 } });
        return Array.isArray(data) ? data : data.products || [];
      } catch { return []; }
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] -mt-[88px] flex items-end overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: "easeOut" }}
          src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        <div className="relative container mx-auto px-6 pb-24 pt-40 text-white">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] mb-6 text-white/80">
            Atelier collection — Autumn 2026
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            Furniture made<br />to outlive us.
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="mt-12 max-w-xl">
            <form
              onSubmit={(e) => { e.preventDefault(); router.navigate({ to: "/shop", search: { q } as any }); }}
              className="glass flex items-center gap-2 p-2 rounded-full"
            >
              <Search className="h-4 w-4 ml-3 text-foreground" />
              <Input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search walnut, brass, lounge chairs…"
                className="border-0 bg-transparent text-foreground focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-full">Explore</Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTERS quick row */}
      <section className="border-y border-border/60 bg-[oklch(0.95_0.012_85)]">
        <div className="container mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-6">
          {["Seating", "Tables", "Lighting", "Storage", "Outdoor", "Rugs"].map((c) => (
            <Link key={c} to="/shop" className="text-sm uppercase tracking-widest hover:text-accent transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <Section
        eyebrow="Featured collection"
        title="Pieces with provenance"
        cta={{ label: "View the collection", to: "/shop" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.data?.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          {!featured.isLoading && !featured.data?.length && <EmptyState />}
        </div>
      </Section>

      {/* INTERIORS BANNER */}
      <section className="relative min-h-[70vh] flex items-center my-16">
        <img src={INTERIORS} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-6 text-white max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] mb-6 text-white/80">Inside Aurelian</p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">
            Quiet rooms.<br />Honest materials.<br />A century of patina.
          </h2>
          <Button variant="outline" className="mt-10 bg-transparent border-white text-white hover:bg-white hover:text-black" asChild>
            <Link to="/about">Our atelier <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* BEST SELLERS */}
      <Section eyebrow="Most desired" title="Best sellers" cta={{ label: "Shop all", to: "/shop" }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellers.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : bestSellers.data?.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          {!bestSellers.isLoading && !bestSellers.data?.length && <EmptyState />}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { q: "Every Aurelian piece feels like it's been in the family for generations.", a: "— Architectural Digest" },
            { q: "The most quietly luxurious furniture we specify, season after season.", a: "— Studio Lavín, Madrid" },
            { q: "Heirlooms in the making. Worth the wait, worth the price.", a: "— The Modern House" },
          ].map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="border-l border-accent pl-6"
            >
              <blockquote className="font-serif text-2xl leading-snug">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{t.a}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CONTRACTOR */}
      <section className="grid md:grid-cols-2 min-h-[60vh]">
        <div className="bg-[oklch(0.18_0.012_60)] text-[oklch(0.97_0.012_85)] flex items-center p-12 md:p-20">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] mb-6 text-white/60">Trade program</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">For contractors, architects & studios.</h2>
            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Custom finishes, dedicated lead times, and account pricing for your projects. Submit a brief and we'll respond within 48 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary"><Link to="/bookings">Request a booking</Link></Button>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10"><Link to="/contractor">Contractor portal</Link></Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 text-sm">
              {[{i:Award,t:"Trade pricing"},{i:Hammer,t:"Custom commissions"},{i:Truck,t:"White-glove delivery"}].map(({i:Icon,t}) => (
                <div key={t}><Icon className="h-5 w-5 text-bronze mb-2" /><div>{t}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative min-h-[400px]">
          <img src={CONTRACTOR} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>
    </div>
  );
}

function Section({ eyebrow, title, cta, children }: any) {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">{eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl">{title}</h2>
        </div>
        {cta && (
          <Link to={cta.to} className="text-sm uppercase tracking-widest hover:text-accent flex items-center gap-2">
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-16 border border-dashed border-border/60">
      <p className="text-muted-foreground">No products yet. Connect your backend at <code>localhost:8000</code> to populate the collection.</p>
    </div>
  );
}
