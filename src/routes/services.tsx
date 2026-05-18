import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTag } from "@/components/SectionTag";
import { ArrowButton } from "@/components/ArrowButton";
import residential from "@/assets/service-residential.jpg";
import commercial from "@/assets/service-commercial.jpg";
import maintenance from "@/assets/service-maintenance.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Green Spark Solar" },
      { name: "description", content: "Residential, commercial and maintenance solar services." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { img: residential, title: "Residential Solar Installation", price: "₹1,32,000", old: "₹2,10,000", desc: "Custom solar panel systems for homes. Estimate for 3kW after PM Surya Ghar subsidy." },
  { img: commercial, title: "Commercial Solar Plants", price: "₹55,000 /kW", old: "₹70,000 /kW", desc: "Large-scale installations for businesses ready to switch to renewable, sustainable power." },
  { img: maintenance, title: "Maintenance & Cleaning", price: "₹4,999 /yr", old: "₹7,999 /yr", desc: "Keep your system performing at peak with expert inspections and deep cleaning." },
];

function ServicesPage() {
  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag>Our Services</SectionTag>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 items-end">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-display text-5xl md:text-7xl">Harness the Sun<br />Energy Solutions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-muted-foreground text-lg max-w-md">Explore our range of solar services designed to reduce your energy bills, lower carbon footprint, and ensure long-term environmental and financial benefits.</motion.p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <motion.div 
              key={s.title} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl bg-card border border-border p-3 flex flex-col"
            >
              <div className="relative">
                <img src={s.img} alt={s.title} loading="lazy" width={1024} height={768} className="rounded-2xl w-full aspect-[4/3] object-cover" />
                <button className="absolute -top-3 -right-3 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><ArrowUpRight className="h-5 w-5" /></button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                    <Star className="h-3 w-3 fill-current" /> 5.0
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground flex-1">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <ArrowButton to="/contact" variant="outline">Get Started</ArrowButton>
                  <div className="text-right">
                    <div className="text-2xl font-semibold">{s.price}</div>
                    <div className="text-xs text-muted-foreground line-through">{s.old}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
