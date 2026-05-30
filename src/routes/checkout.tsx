import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Tha Twinz" }] }),
  component: Checkout,
});

function Checkout() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-5xl mb-8">CHECKOUT</h1>
        <form className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Section title="Contact">
              <Field label="Email" type="email" placeholder="you@email.com" />
            </Section>
            <Section title="Shipping">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" />
                <Field label="Last name" />
              </div>
              <Field label="Address" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" />
                <Field label="Postal code" />
              </div>
            </Section>
            <Section title="Payment">
              <Field label="Card number" placeholder="•••• •••• •••• ••••" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry" placeholder="MM/YY" />
                <Field label="CVC" placeholder="•••" />
              </div>
            </Section>
          </div>
          <div className="bg-gradient-card border border-border rounded-xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-2xl mb-4">ORDER</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>2 items</span><span>R1,398.00</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>FREE</span></div>
              <div className="flex justify-between pt-3 border-t border-border text-foreground font-display text-xl"><span>Total</span><span>R1,398.00</span></div>
            </div>
            <button className="w-full bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-md mt-6 shadow-glow flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Pay securely
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-3">Secure checkout · SSL encrypted</p>
          </div>
        </form>
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-3">
      <h3 className="font-display text-xl">{title.toUpperCase()}</h3>
      {children}
    </div>
  );
}
function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1 w-full bg-input border border-border rounded-md px-3 py-2 text-sm" />
    </label>
  );
}
