import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StaffLogin() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account.");
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` });
    if (r.error) toast.error("Google sign-in failed.");
  };

  return (
    <div className="min-h-screen bg-ink text-ink-foreground flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <Logo size="lg" showTagline />
        <form onSubmit={submit} className="mt-10 bg-card text-card-foreground rounded-md p-8 grid gap-4">
          <h1 className="text-3xl text-center">Staff {mode === "in" ? "sign in" : "sign up"}</h1>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "in" ? "Sign in" : "Create account"}</Button>
          <Button type="button" variant="outline" onClick={google}>Continue with Google</Button>
          <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "New staff member? Create an account" : "Already have an account? Sign in"}
          </button>
          <p className="text-[0.7rem] text-muted-foreground text-center">The first account created becomes the salon administrator.</p>
        </form>
      </div>
    </div>
  );
}
