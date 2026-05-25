import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Aurelian for early access to new collections."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          try {
            await register(form);
            toast.success("Account created");
            router.navigate({ to: "/dashboard" });
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Could not create account");
          } finally {
            setSubmitting(false);
          }
        }}
        className="space-y-5"
      >
        <F label="Full name">
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
        <F label="Password">
          <Input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </F>
        <F label="Account type">
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="contractor">Contractor / Trade</SelectItem>
            </SelectContent>
          </Select>
        </F>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Creating…" : "Create account"}
        </Button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
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
