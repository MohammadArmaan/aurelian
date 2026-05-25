import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const stats = useQuery<any>({
    queryKey: ["admin", "stats"],
    enabled: user?.role === "admin",
    queryFn: async () => (await api.get("/admin/stats")).data,
  });

  if (loading) return null;
  if (!user) { router.navigate({ to: "/login" }); return null; }
  if (user.role !== "admin") {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Restricted</h1>
        <p className="text-muted-foreground mt-2">This area is reserved for administrators.</p>
      </div>
    );
  }

  const s = stats.data || {};
  const metrics = [
    { label: "Users", value: s.users ?? s.totalUsers ?? "—" },
    { label: "Orders", value: s.orders ?? s.totalOrders ?? "—" },
    { label: "Revenue", value: typeof s.revenue === "number" ? `$${s.revenue.toLocaleString()}` : (s.revenue ?? "—") },
    { label: "Products", value: s.products ?? s.totalProducts ?? "—" },
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Atelier operations</p>
      <h1 className="font-serif text-5xl">Admin dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {metrics.map((m) => (
          <div key={m.label} className="border border-border p-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{m.label}</p>
            <p className="font-serif text-4xl mt-3">{stats.isLoading ? "…" : m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
