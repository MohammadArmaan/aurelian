import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  if (loading) return null;
  if (!user) {
    router.navigate({ to: "/login" });
    return null;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", form);
      await refresh();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Welcome back</p>
      <h1 className="font-serif text-5xl">{user.name}</h1>
      <p className="text-muted-foreground mt-2 capitalize">{user.role} account</p>

      <div className="grid md:grid-cols-3 gap-4 mt-12">
        <Quick title="Orders" to="/orders" />
        <Quick title="Wishlist" to="/wishlist" />
        <Quick title="Bookings" to="/bookings" />
      </div>

      <form onSubmit={save} className="mt-16 space-y-5 max-w-md">
        <h2 className="font-serif text-2xl">Account details</h2>
        <Field label="Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

function Quick({ title, to }: { title: string; to: string }) {
  return (
    <Link to={to} className="block border border-border p-6 hover:border-accent transition-colors">
      <h3 className="font-serif text-xl">{title}</h3>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">View →</p>
    </Link>
  );
}
