import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, type Product } from "@/lib/api";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/shop")({
  component: Shop,
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "" }),
});

function Shop() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q);
  const [category, setCategory] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [price, setPrice] = useState<[number, number]>([0, 20000]);

  const products = useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/products");
        return Array.isArray(data) ? data : data.products || [];
      } catch {
        return [];
      }
    },
  });

  const categories = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/categories");
        return Array.isArray(data) ? data : data.categories || [];
      } catch {
        return [];
      }
    },
  });

  const filtered = useMemo(() => {
    return (products.data || []).filter((p) => {
      if (q && !`${p.name} ${p.description ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (category && (typeof p.category === "string" ? p.category : p.category?.name) !== category)
        return false;
      if (material && p.material !== material) return false;
      if (location && p.location !== location) return false;
      if (rating && (p.rating ?? 0) < Number(rating)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
  }, [products.data, q, category, material, location, rating, price]);

  const materials = useMemo(
    () =>
      Array.from(new Set((products.data || []).map((p) => p.material).filter(Boolean))) as string[],
    [products.data],
  );
  const locations = useMemo(
    () =>
      Array.from(new Set((products.data || []).map((p) => p.location).filter(Boolean))) as string[],
    [products.data],
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
          The collection
        </p>
        <h1 className="font-serif text-5xl md:text-6xl">Shop everything</h1>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        {/* FILTERS */}
        <aside className="space-y-8">
          <div>
            <label className="text-xs uppercase tracking-widest mb-3 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products"
                className="pl-9"
              />
            </div>
          </div>

          <FilterSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={(categories.data || []).map((c: any) => c.name || c)}
          />
          <FilterSelect
            label="Material"
            value={material}
            onChange={setMaterial}
            options={materials}
          />
          <FilterSelect
            label="Location"
            value={location}
            onChange={setLocation}
            options={locations}
          />
          <FilterSelect
            label="Min rating"
            value={rating}
            onChange={setRating}
            options={["3", "4", "4.5"]}
          />

          <div>
            <label className="text-xs uppercase tracking-widest mb-3 block">
              Price ${price[0]} — ${price[1]}
            </label>
            <Slider
              min={0}
              max={20000}
              step={100}
              value={price}
              onValueChange={(v) => setPrice(v as [number, number])}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setQ("");
              setCategory("");
              setMaterial("");
              setLocation("");
              setRating("");
              setPrice([0, 20000]);
            }}
          >
            <SlidersHorizontal className="h-4 w-4" /> Clear filters
          </Button>
        </aside>

        {/* GRID */}
        <div>
          <p className="text-sm text-muted-foreground mb-8">{filtered.length} pieces</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {products.isLoading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          {!products.isLoading && !filtered.length && (
            <div className="text-center py-24 border border-dashed border-border/60">
              <p className="text-muted-foreground">No pieces match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest mb-3 block">{label}</label>
      <Select value={value || "__all"} onValueChange={(v) => onChange(v === "__all" ? "" : v)}>
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
