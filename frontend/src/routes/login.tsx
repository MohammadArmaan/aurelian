import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Aurelian account.">
      <form onSubmit={async (e) => {
        e.preventDefault(); setSubmitting(true);
        try { await login(email, password); toast.success("Welcome back"); router.navigate({ to: "/dashboard" }); }
        catch (err: any) { toast.error(err?.response?.data?.message || "Invalid credentials"); }
        finally { setSubmitting(false); }
      }} className="space-y-5">
        <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
        <div className="text-sm text-center text-muted-foreground">
          <Link to="/forgot-password" className="hover:text-accent">Forgot password?</Link>
        </div>
        <p className="text-sm text-center">No account? <Link to="/signup" className="text-accent underline-offset-4 hover:underline">Create one</Link></p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: any) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <Link to="/" className="absolute top-8 left-8 text-white font-serif text-2xl">Aurelian.</Link>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="font-serif text-3xl leading-tight max-w-md">"The furniture we live with should outlast the trends that surround it."</p>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-serif text-2xl block mb-12">Aurelian.</Link>
          <h1 className="font-serif text-4xl">{title}</h1>
          <p className="text-muted-foreground mt-2 mb-10">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: any) {
  return <div><Label className="text-xs uppercase tracking-widest mb-2 block">{label}</Label>{children}</div>;
}
