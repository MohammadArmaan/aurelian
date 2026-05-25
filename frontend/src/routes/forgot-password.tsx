import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <AuthShell title="Reset your password" subtitle="We'll send you a recovery link.">
      {sent ? (
        <div className="space-y-4">
          <p>If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>
          <Link to="/login" className="text-accent underline-offset-4 hover:underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={async (e) => {
          e.preventDefault(); setBusy(true);
          try { await api.post("/auth/forgot-password", { email }); setSent(true); }
          catch { toast.success("If that email exists, a link has been sent."); setSent(true); }
          finally { setBusy(false); }
        }} className="space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-widest mb-2 block">Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button>
          <p className="text-sm text-center"><Link to="/login" className="text-accent">Back to sign in</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
