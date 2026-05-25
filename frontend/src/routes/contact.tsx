import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/bookings", { type: "contact", ...form });
      toast.success("Message sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not send");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <h1 className="font-serif text-5xl">Get in touch</h1>
      <p className="text-muted-foreground mt-3">We respond to every inquiry within 48 hours.</p>

      <div className="grid md:grid-cols-2 gap-16 mt-16">
        <form onSubmit={submit} className="space-y-5">
          <F label="Name">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </F>
          <F label="Email">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </F>
          <F label="Message">
            <Textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </F>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </Button>
        </form>
        <div className="space-y-8 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Atelier</p>
            <p>
              Via dei Maestri 14
              <br />
              50122 Florence, Italy
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</p>
            <p>atelier@aurelian.studio</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hours</p>
            <p>
              Mon — Fri, 9:00 to 18:00 CET
              <br />
              By appointment Saturday.
            </p>
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
