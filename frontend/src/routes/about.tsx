import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <div>
      <section className="relative min-h-[60vh] flex items-end -mt-[88px]">
        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-6 pt-40 pb-20 text-white">
          <p className="text-xs uppercase tracking-[0.4em] mb-4 text-white/80">Our story</p>
          <h1 className="font-serif text-5xl md:text-7xl max-w-3xl leading-[0.95]">Built slowly, in a quiet atelier outside Florence.</h1>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 max-w-6xl">
        {[
          { y: "1972", t: "A single chair", d: "Our founder, Marco Aurelian, began with a single dining chair commissioned for a friend's villa. Word travelled." },
          { y: "1998", t: "The atelier", d: "We outgrew our garage. A 12,000 sqft restored mill became our home — half showroom, half workshop." },
          { y: "2014", t: "The trade program", d: "Architects and designers began specifying our pieces. We formalized our trade program and introduced custom commissions." },
          { y: "Today", t: "Heirlooms, modern", d: "We ship to 47 countries. Every piece still passes through hands we know by name." },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <p className="text-bronze font-serif text-3xl">{s.y}</p>
            <h3 className="font-serif text-2xl mt-2">{s.t}</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
