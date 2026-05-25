import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders")({ component: Orders });

function Orders() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const q = useQuery<any[]>({
    queryKey: ["orders", "mine"],
    enabled: !!user,
    queryFn: async () => { try { const { data } = await api.get("/orders/mine"); return Array.isArray(data) ? data : data.orders || []; } catch { return []; } },
  });

  if (loading) return null;
  if (!user) { router.navigate({ to: "/login" }); return null; }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl mb-12">Orders</h1>
      {q.isLoading && <div className="h-40 bg-muted animate-pulse" />}
      {!q.isLoading && !q.data?.length && (
        <div className="text-center py-24 border border-dashed border-border">
          <p className="font-serif text-2xl">No orders yet</p>
        </div>
      )}
      <div className="space-y-4">
        {q.data?.map((o: any) => (
          <div key={o._id} className="border border-border p-6 flex justify-between items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
              <div className="font-serif text-lg">#{o._id?.slice(-8)}</div>
              <div className="text-sm text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="font-serif text-xl">${(o.total ?? o.totalPrice ?? 0).toLocaleString()}</div>
              <div className="text-xs uppercase tracking-widest mt-1">{o.status || "pending"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
