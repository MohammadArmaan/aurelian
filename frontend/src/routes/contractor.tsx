import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contractor")({ component: ContractorPortal });

function ContractorPortal() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({ company: "", specialty: "", portfolio: "", notes: "" });

  const bookings = useQuery<any[]>({
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

  const apply = useMutation({
    mutationFn: async () => (await api.post("/contractors", form)).data,
    onSuccess: () => {
      toast.success("Application submitted");
      setForm({ company: "", specialty: "", portfolio: "", notes: "" });
      qc.invalidateQueries();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not submit"),
  });

  if (loading) return null;
  if (!user) {
    router.navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Trade program</p>
      <h1 className="font-serif text-5xl">Contractor portal</h1>

      <div className="grid md:grid-cols-2 gap-12 mt-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply.mutate();
          }}
          className="space-y-5"
        >
          <h2 className="font-serif text-2xl">Apply / update studio</h2>
          <F label="Company">
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </F>
          <F label="Specialty">
            <Input
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              placeholder="Residential, hospitality…"
            />
          </F>
          <F label="Portfolio URL">
            <Input
              value={form.portfolio}
              onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            />
          </F>
          <F label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </F>
          <Button type="submit" disabled={apply.isPending}>
            {apply.isPending ? "Submitting…" : "Submit"}
          </Button>
        </form>

        <div>
          <h2 className="font-serif text-2xl mb-6">Your booking requests</h2>
          <div className="space-y-4">
            {bookings.data?.length ? (
              bookings.data.map((b: any) => (
                <div key={b._id} className="border border-border p-4">
                  <div className="flex justify-between">
                    <strong>{b.type || "Booking"}</strong>
                    <span className="text-xs uppercase">{b.status || "pending"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{b.message}</p>
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
