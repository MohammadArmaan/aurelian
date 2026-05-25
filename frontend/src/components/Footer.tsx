import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 border-t border-border/60 bg-[oklch(0.95_0.012_85)]">
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl">
            Aurelian<span className="text-accent">.</span>
          </div>
          <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
            Heirloom furniture, made by hand. Designed to last lifetimes, sourced from the world's
            most respected ateliers.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) {
                toast.success("Subscribed to the journal");
                setEmail("");
              }
            }}
            className="mt-8 flex max-w-sm gap-2"
          >
            <Input
              placeholder="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop">All furniture</Link>
            </li>
            <li>
              <Link to="/shop">Seating</Link>
            </li>
            <li>
              <Link to="/shop">Tables</Link>
            </li>
            <li>
              <Link to="/shop">Lighting</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Atelier</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about">Our story</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/bookings">Trade program</Link>
            </li>
            <li>
              <Link to="/dashboard">Account</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aurelian. All rights reserved.
      </div>
    </footer>
  );
}
