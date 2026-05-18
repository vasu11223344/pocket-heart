import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { Calculator, IndianRupee, Sun, TrendingUp, Zap, Sparkles } from "lucide-react";
import { SectionTag } from "@/components/SectionTag";
import { ArrowButton } from "@/components/ArrowButton";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { scanBill } from "@/lib/chat.functions";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Solar Savings Calculator — Green Spark Solar" },
      { name: "description", content: "Estimate your solar system size, PM Surya Ghar subsidy, monthly savings and payback period." },
      { property: "og:title", content: "Solar Savings Calculator — Green Spark Solar" },
      { property: "og:description", content: "See how much you'll save with rooftop solar in India." },
    ],
  }),
  component: CalcPage,
});

const COST_PER_KW = 70000; // ₹ per kW installed
const UNITS_PER_KW_PER_MONTH = 120;
const TARIFF = 7; // ₹/unit

function subsidyFor(kw: number) {
  if (kw <= 0) return 0;
  if (kw < 2) return 30000;
  if (kw < 3) return 60000;
  return 78000; // 3-10 kW (capped by PM Surya Ghar)
}

function CalcPage() {
  const [mode, setMode] = useState<"bill" | "kw">("bill");
  const [bill, setBill] = useState(3000);
  const [kwInput, setKwInput] = useState(3);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const doScan = useServerFn(scanBill);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setScanning(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        if (!base64) return;
        try {
          const result = await doScan({ data: { imageBase64: base64, mimeType: file.type } });
          if (result > 0) setBill(result);
          else alert("Could not find a clear amount. Please enter manually.");
        } catch (err: any) {
          alert(err.message || "Failed to scan bill.");
        } finally {
          setScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const result = useMemo(() => {
    let kw: number;
    if (mode === "bill") {
      const monthlyUnits = bill / TARIFF;
      kw = Math.max(1, Math.round(monthlyUnits / UNITS_PER_KW_PER_MONTH));
    } else {
      kw = Math.max(1, Math.min(10, kwInput));
    }
    const grossCost = kw * COST_PER_KW;
    const subsidy = subsidyFor(kw);
    const netCost = Math.max(0, grossCost - subsidy);
    const monthlyUnits = kw * UNITS_PER_KW_PER_MONTH;
    const monthlySavings = monthlyUnits * TARIFF;
    const yearlySavings = monthlySavings * 12;
    const paybackYears = netCost / yearlySavings;
    const lifetimeSavings = yearlySavings * 25 - netCost;
    return { kw, grossCost, subsidy, netCost, monthlyUnits, monthlySavings, yearlySavings, paybackYears, lifetimeSavings };
  }, [mode, bill, kwInput]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionTag>Savings Calculator</SectionTag>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-display text-4xl md:text-6xl max-w-3xl"
        >
          See how much you'll save with rooftop solar.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-muted-foreground"
        >
          Indicative numbers based on Andhra Pradesh tariffs and PM Surya Ghar subsidy. We confirm exact pricing during a free site visit.
        </motion.p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* INPUTS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Your usage</h2>

            <div className="mt-6 inline-flex rounded-full border border-border p-1 bg-background">
              <button onClick={() => setMode("bill")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "bill" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Monthly bill</button>
              <button onClick={() => setMode("kw")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "kw" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>System size</button>
            </div>

            {mode === "bill" ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                  <label className="text-sm font-medium block">Monthly electricity bill (₹)</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={scanning}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-full transition disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {scanning ? "Scanning..." : "Scan Bill with AI"}
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleScan} 
                  />
                </div>
                <input
                  type="number"
                  value={bill}
                  onChange={(e) => setBill(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-lg"
                />
                <input
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  value={bill}
                  onChange={(e) => setBill(parseInt(e.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹500</span><span>₹20,000</span>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <label className="text-sm font-medium block mb-2">System size (kW)</label>
                <input
                  type="number"
                  value={kwInput}
                  min={1}
                  max={10}
                  onChange={(e) => setKwInput(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-lg"
                />
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={kwInput}
                  onChange={(e) => setKwInput(parseInt(e.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 kW</span><span>10 kW</span>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-primary/10 border border-primary/30 p-5">
              <div className="text-sm text-muted-foreground">Recommended system</div>
              <div className="mt-1 text-4xl font-semibold text-primary flex items-center gap-2">
                <Sun className="h-7 w-7" />{result.kw} kW
              </div>
              <div className="mt-2 text-sm text-muted-foreground">≈ {result.monthlyUnits} units/month generation</div>
            </div>
          </motion.div>

          {/* RESULTS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Your savings</h2>

            <Row icon={<IndianRupee />} label="System cost" value={fmt(result.grossCost)} muted />
            <Row icon={<IndianRupee />} label="PM Surya Ghar subsidy" value={`− ${fmt(result.subsidy)}`} accent />
            <div className="border-t border-border pt-4">
              <Row icon={<IndianRupee />} label="Net you pay" value={fmt(result.netCost)} bold />
            </div>
            <Row icon={<Zap />} label="Monthly savings" value={fmt(result.monthlySavings)} />
            <Row icon={<TrendingUp />} label="Yearly savings" value={fmt(result.yearlySavings)} />
            <Row icon={<Sun />} label="Payback period" value={`${result.paybackYears.toFixed(1)} years`} />
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 mt-4">
              <div className="text-xs opacity-80">Lifetime savings (25 years)</div>
              <div className="mt-1 text-3xl font-semibold">{fmt(result.lifetimeSavings)}</div>
            </div>

            <div className="pt-4">
              <ArrowButton to="/contact" search={{ source: "quote" }} variant="primary">Get a Free Quote</ArrowButton>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-border bg-surface/50 p-6 sm:p-8"
        >
          <h3 className="text-xl font-semibold">PM Surya Ghar Subsidy</h3>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            <SubsidyRow size="1 kW" amount="₹30,000" />
            <SubsidyRow size="2 kW" amount="₹60,000" />
            <SubsidyRow size="3 kW – 10 kW" amount="₹78,000" />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            We handle the complete subsidy paperwork and bank loan process. 25-year warranty on solar panels. Free site assessment and design.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, muted, accent, bold }: { icon: React.ReactNode; label: string; value: string; muted?: boolean; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`flex items-center gap-2 text-sm ${muted ? "text-muted-foreground" : ""}`}>
        <span className="[&>svg]:h-4 [&>svg]:w-4 text-primary">{icon}</span>{label}
      </span>
      <span className={`${bold ? "text-2xl font-semibold" : "text-base font-medium"} ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}

function SubsidyRow({ size, amount }: { size: string; amount: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="text-xs text-muted-foreground">{size}</div>
      <div className="text-2xl font-semibold text-primary mt-1">{amount}</div>
    </div>
  );
}
