import { createFileRoute } from "@tanstack/react-router";
import { SectionTag } from "@/components/SectionTag";
import { ArrowButton } from "@/components/ArrowButton";
import { useSettings } from "@/hooks/use-settings";
import villageImg from "@/assets/about-village.jpg";
import { Award, Battery, Building2, Home, Leaf, Shield, Sun, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Green Spark Solar" },
      { name: "description", content: "Premium solar installations for residential, commercial and farm use across Andhra Pradesh." },
      { property: "og:title", content: "About — Green Spark Solar" },
      { property: "og:description", content: "Government-approved solar systems with PM Surya Ghar subsidy support." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const s = useSettings();
  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag>About Us</SectionTag>
        <h1 className="mt-6 text-display text-5xl md:text-7xl max-w-4xl">
          Power your home with the sun — and keep more in your pocket.
        </h1>
        <p className="mt-6 max-w-3xl text-muted-foreground text-lg">
          {s?.about_heading || "Green Spark Solar is an Andhra Pradesh-based solar installer offering premium rooftop systems for homes, businesses, and farms. We handle everything — site survey, design, installation, bank loan and PM Surya Ghar subsidy paperwork — so you get clean power without the hassle."}
        </p>

        <motion.img 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={villageImg} alt="Solar village" loading="lazy" width={1024} height={1024} className="mt-12 w-full max-h-[60vh] object-cover rounded-3xl" 
        />

        {/* WHAT WE DO */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <SectionTag>What We Do</SectionTag>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card icon={<Home />} title="Residential Solar" desc="Rooftop systems for homes, with PM Surya Ghar subsidy up to ₹78,000." />
            <Card icon={<Building2 />} title="Commercial Solar" desc="Custom solar plants for businesses, factories, and offices to slash power bills." />
            <Card icon={<Sun />} title="Farm Solar" desc="Solar pumps and panels for agriculture — reliable power for irrigation and farm use." />
            <Card icon={<Battery />} title="Battery Storage" desc="Lithium battery backup so you have power even when the grid goes down." />
            <Card icon={<Shield />} title="Loan + Subsidy Help" desc="We process your bank loan and the entire PM Surya Ghar subsidy application." />
            <Card icon={<Wrench />} title="25-Year Warranty" desc="Tier-1 panels with manufacturer warranty and on-going service support." />
          </div>
        </motion.section>

        {/* WHY CHOOSE US */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <SectionTag>Why Choose Us</SectionTag>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card icon={<Award />} title="Govt. Approved" desc="MNRE-empanelled installer." />
            <Card icon={<Sun />} title="Premium Brands" desc="Tata Solar, Adani Solar, Waaree." />
            <Card icon={<Wrench />} title="Expert Engineers" desc="Licensed and trained team." />
            <Card icon={<Leaf />} title="Eco-Friendly" desc="Cut your carbon footprint." />
          </div>
        </motion.section>

        {/* PARTNERS */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <SectionTag>Top Solar Brands We Use</SectionTag>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-border bg-card p-8">
            <Brand name="Tata Power Solar" />
            <Brand name="Adani Solar" />
            <Brand name="Waaree" />
            <Brand name="Vikram Solar" />
            <Brand name="Loom Solar" />
          </div>
        </motion.section>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {[
            { n: `${s?.warranty_years || 25} yr`, l: "Panel warranty" },
            { n: "₹78,000", l: "PM Surya Ghar max subsidy" },
            { n: "500+", l: "Happy customers" },
          ].map((x) => (
            <div key={x.l} className="rounded-3xl border border-border bg-card p-8">
              <div className="text-display text-5xl text-primary">{x.n}</div>
              <div className="mt-2 text-muted-foreground">{x.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <ArrowButton to="/contact" variant="primary">Request a Free Quote</ArrowButton>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="text-primary [&>svg]:h-7 [&>svg]:w-7">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function Brand({ name }: { name: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-background border border-border px-6 py-4 text-sm font-semibold text-foreground/90"
    >
      {name}
    </motion.div>
  );
}
