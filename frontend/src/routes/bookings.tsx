import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/bookings")({ component: Bookings });

function Bookings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({ type: "consultation", date: "", message: "" });

  const q = useQuery<any[]>({
    queryKey: ["bookings", "mine"],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data } = await api.get("/bookings/mine");
        return Array.isArray(data) ? data : data.bookings || [];
      } catch {
        return [];
      }
    },
  });

  const create = useMutation({
    mutationFn: async () => (await api.post("/bookings", form)).data,
    onSuccess: () => {
      toast.success("Booking requested");
      setForm({ type: "consultation", date: "", message: "" });
      qc.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not request booking"),
  });

  if (loading) return null;
  if (!user) {
    router.navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <h1 className="font-serif text-5xl mb-12">Booking requests</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="space-y-5"
        >
          <h2 className="font-serif text-2xl">Request a consultation</h2>
          <F label="Type">
            <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </F>
          <F label="Preferred date">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </F>
          <F label="Notes">
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us about the project…"
            />
          </F>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Sending…" : "Submit request"}
          </Button>
        </form>
        <div>
          <h2 className="font-serif text-2xl mb-6">Your requests</h2>
          <div className="space-y-3">
            {q.data?.length ? (
              q.data.map((b: any) => (
                <div key={b._id} className="border border-border p-4">
                  <div className="flex justify-between">
                    <strong className="capitalize">{b.type}</strong>
                    <span className="text-xs uppercase">{b.status || "pending"}</span>
                  </div>
                  {b.date && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                  )}
                  {b.message && <p className="text-sm mt-2">{b.message}</p>}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No bookings yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function F({ label, children }: any) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
