import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, Leaf, Sun, Hourglass, Play, Star, Battery, Building2, Home, Phone, Shield, Wrench, MapPin, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { syncToGoogleSheets } from "@/lib/google-sheets.functions";
import heroImg from "@/assets/hero-solar.jpg";
import villageImg from "@/assets/about-village.jpg";
import residentialImg from "@/assets/service-residential.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import farmImg from "@/assets/service-farm.jpg";
import batteryImg from "@/assets/service-battery.jpg";
import { ArrowButton } from "@/components/ArrowButton";
import { SectionTag } from "@/components/SectionTag";
import { useSettings } from "@/hooks/use-settings";
import {
  listGallery,
  listApprovedReviews,
  listTestimonials,
  submitReview,
  subscribeReviews,
  type Review,
} from "@/integrations/pocketbase/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Spark Solar — Rooftop Solar with PM Surya Ghar Subsidy" },
      { name: "description", content: "Residential, commercial and farm solar in Andhra Pradesh. PM Surya Ghar subsidy up to ₹78,000. 25-year warranty." },
      { property: "og:title", content: "Green Spark Solar — Power Your Home with the Sun" },
      { property: "og:description", content: "Premium solar installations with full subsidy + loan support." },
    ],
  }),
  component: HomePage,
});

interface GalleryImg { id: string; image_url: string; caption: string | null; }

const BRANDS = ["TATA Power Solar", "Adani Solar", "WAAREE", "Vikram Solar", "Loom Solar", "Luminous", "Havells Solar", "Microtek"];

function HomePage() {
  const s = useSettings();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryImg[]>([]);

  const loadReviews = () => {
    Promise.all([
      listApprovedReviews(20).catch(() => []),
      listTestimonials({ onlyPublished: true }).catch(() => [])
    ])
      .then(([reviewsData, testimonialsData]) => {
        const legacyReviews: Review[] = testimonialsData.map((t) => ({
          id: t.id,
          customer_name: t.name,
          customer_photo: t.avatar_url,
          rating: t.rating,
          review_message: t.message,
          location: t.location,
          approved: true,
          created_at: "",
        }));
        setReviews([...reviewsData, ...legacyReviews]);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    loadReviews();
    listGallery({ onlyPublished: true, limit: 6 })
      .then((d) => setGallery(d as unknown as GalleryImg[]))
      .catch(() => setGallery([]));
    // realtime — refresh whenever a review is approved/created/deleted
    const unsub = subscribeReviews(() => loadReviews());
    return () => unsub();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative px-4 sm:px-6 pt-32 pb-12">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] min-h-[88vh] flex flex-col justify-between">
          <img src={heroImg} alt="Solar panels across green hills" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
          


          <div className="relative pt-24 sm:pt-28 px-6 sm:px-12">
            <motion.h1 
              className="text-display text-white text-[clamp(3.5rem,11vw,12rem)] font-medium drop-shadow-2xl leading-[0.9] flex flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {(s?.hero_title || "Green Spark Solar").split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <div className="relative px-6 sm:px-12 pb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-white text-sm">
              <Sun className="h-4 w-4 text-primary" />
              {s?.hero_eyebrow || "PM Surya Ghar Subsidy Available"}
            </div>
            <div className="mt-8 flex flex-col lg:flex-row items-end justify-between gap-8">
              <h2 className="text-display text-white text-5xl md:text-7xl max-w-3xl">
                {s?.hero_subtitle || "Power Your Home with the Sun"}
              </h2>
              <div className="flex flex-wrap gap-3">
                <Stat value="₹78,000" label="PM Surya Ghar subsidy" />
                <Stat value="25 yrs" label="Panel warranty" />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ArrowButton to="/contact" variant="dark">Get Free Quote</ArrowButton>
              <Link to="/calculator" className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white pl-2 pr-5 py-1.5 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-background">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Savings Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTag>What We Do</SectionTag>
          <h2 className="mt-6 text-display text-4xl md:text-6xl max-w-3xl">Solar for every need.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard image={residentialImg} title="Residential" desc="Rooftop solar for homes with full subsidy support." />
            <ServiceCard image={commercialImg} title="Commercial" desc="Cut business power costs with custom solar plants." />
            <ServiceCard image={farmImg} title="Farm Solar" desc="Solar pumps and panels for irrigation and farms." />
            <ServiceCard image={batteryImg} title="Battery Storage" desc="Lithium backup for power even during outages." />
          </div>
        </div>
      </motion.section>

      {/* WHO WE ARE */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-24 bg-surface/50"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTag>Who We Are</SectionTag>
          <div className="mt-10 grid gap-12 lg:grid-cols-2 items-center">
            <img src={villageImg} alt="Sustainable solar village" loading="lazy" width={1024} height={1024} className="rounded-3xl w-full aspect-[4/5] object-cover" />
            <div>
              <h2 className="text-display text-4xl md:text-5xl">
                {s?.about_heading || "We provide premium solar installations for residential, commercial and farm use — including battery storage."}
              </h2>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <ArrowButton to="/about" variant="primary">Read More</ArrowButton>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-emerald-400" />
                    ))}
                  </div>
                  <div>
                    <div className="flex text-primary">
                      {[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <div className="text-xs text-muted-foreground">500+ Happy Customers</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                <Feature icon={<Award />} title="Govt. Approved" desc="MNRE-empanelled installer." />
                <Feature icon={<Shield />} title="Loan + Subsidy" desc="We handle the full subsidy paperwork." />
                <Feature icon={<Wrench />} title="Expert Engineers" desc="Licensed, experienced team." />
                <Feature icon={<Hourglass />} title="25-Year Warranty" desc="Long-term performance guarantee." />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SUBSIDY */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTag>PM Surya Ghar Subsidy</SectionTag>
          <h2 className="mt-6 text-display text-4xl md:text-5xl max-w-3xl">Government subsidy made simple.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{s?.loan_info || "We support the complete loan and subsidy sanctioning process."}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <SubsidyCard size="1 kW" amount="₹30,000" />
            <SubsidyCard size="2 kW" amount="₹60,000" />
            <SubsidyCard size="3 – 10 kW" amount="₹78,000" />
          </div>
          <div className="mt-8">
            <ArrowButton to="/calculator" variant="primary">Calculate My Savings</ArrowButton>
          </div>
        </div>
      </motion.section>

      {/* PARTNERS — glassmorphism marquee */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative px-0 py-20 bg-gradient-to-b from-surface/40 via-background to-surface/40 overflow-hidden"
      >
        <div className="px-4 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <SectionTag>Top Solar Brands We Use</SectionTag>
            <h2 className="mt-6 text-display text-3xl md:text-5xl">
              Trusted hardware. Government-approved.
            </h2>
          </div>
        </div>

        <div className="mt-12 marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-5 pr-5">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div
                key={`${b}-${i}`}
                className="glass-panel shrink-0 rounded-2xl px-8 py-5 min-w-[220px] text-center"
              >
                <div className="text-base md:text-lg font-bold tracking-wide whitespace-nowrap bg-gradient-to-r from-[#22c55e] via-white to-[#3b82f6] bg-clip-text text-transparent">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-8 py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <SectionTag>Gallery</SectionTag>
                <h2 className="mt-6 text-display text-4xl md:text-5xl">Recent installations.</h2>
              </div>
              <ArrowButton to="/gallery" variant="outline">View All</ArrowButton>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map(g => (
                <figure key={g.id} className="rounded-3xl overflow-hidden border border-border bg-card">
                  <img src={g.image_url} alt={g.caption || "Installation"} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  {g.caption && <figcaption className="p-4 text-sm text-muted-foreground">{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* REVIEWS — dynamic carousel + submission form */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-24 bg-surface/50"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTag>Customer Reviews</SectionTag>
          <h2 className="mt-6 text-display text-4xl md:text-5xl max-w-2xl">What our customers say.</h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ReviewsCarousel reviews={reviews} />
            <ReviewForm whatsappNumber={s?.whatsapp_number || s?.contact_phone || ""} onSubmitted={loadReviews} />
          </div>
        </div>
      </motion.section>

      {/* MAP + CONTACT */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-24"
      >
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2 items-stretch">
          <div>
            <SectionTag>Visit Us</SectionTag>
            <h2 className="mt-6 text-display text-4xl md:text-5xl">Find our office.</h2>
            <div className="mt-8 space-y-5">
              <ContactRow icon={<MapPin />} label="Head Office" value={s?.address_head_office || ""} />
              <ContactRow icon={<MapPin />} label="Branch Office" value={s?.address_branch_office || ""} />
              <ContactRow icon={<Phone />} label="Call Us" value={[s?.contact_phone, s?.phone_secondary, s?.phone_tertiary].filter(Boolean).join(" · ")} />
            </div>
            <div className="mt-8">
              <ArrowButton to="/contact" variant="primary">Send a Message</ArrowButton>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border bg-card min-h-[400px]">
            <iframe
              title="Green Spark Solar location"
              src={s?.map_embed_url || "https://www.google.com/maps?q=Mangalagiri,Guntur,Andhra+Pradesh&output=embed"}
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </motion.section>
    </>
  );
}


function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-background/40 backdrop-blur-md border border-white/15 p-5 w-56"
    >
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="text-xs text-white/70 mt-1">{label}</div>
    </motion.div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="text-primary [&>svg]:h-7 [&>svg]:w-7">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function ServiceCard({ image, title, desc }: { image: string; title: string; desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-card border border-border overflow-hidden hover:border-primary transition group"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} loading="lazy" width={768} height={576} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
    </motion.div>
  );
}

function SubsidyCard({ size, amount }: { size: string; amount: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-card border border-border p-8 text-center"
    >
      <div className="text-sm text-muted-foreground">{size}</div>
      <div className="mt-2 text-4xl font-semibold text-primary">{amount}</div>
      <div className="mt-2 text-xs text-muted-foreground">PM Surya Ghar subsidy</div>
    </motion.div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-start gap-4"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Reviews carousel ───────────────────────── */

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const perPage = 1;
  const pages = useMemo(() => {
    if (reviews.length === 0) return [];
    const out: Review[][] = [];
    for (let i = 0; i < reviews.length; i += perPage) out.push(reviews.slice(i, i + perPage));
    return out;
  }, [reviews]);

  useEffect(() => {
    if (pages.length <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pages.length), 6000);
    return () => clearInterval(t);
  }, [pages.length]);

  if (reviews.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center">
        <Star className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-4 text-muted-foreground">
          No reviews yet — be the first to share your experience!
        </p>
      </div>
    );
  }

  const current = pages[page] ?? [];

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {current.map((r) => (
            <motion.article 
              key={`${r.id}-${page}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="glass-panel rounded-3xl p-7"
            >
              <div className="flex items-center gap-4">
                {r.customer_photo ? (
                  <img src={r.customer_photo} alt={r.customer_name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/40" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] grid place-items-center text-white text-xl font-bold">
                    {r.customer_name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold">{r.customer_name}</div>
                  {r.location && <div className="text-xs text-muted-foreground">{r.location}</div>}
                  <div className="mt-1 flex text-primary">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-base leading-relaxed text-foreground/90 italic">"{r.review_message}"</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {pages.length > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-8 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => (p - 1 + pages.length) % pages.length)}
              className="grid h-10 w-10 place-items-center rounded-full glass-panel hover:bg-white/10"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => (p + 1) % pages.length)}
              className="grid h-10 w-10 place-items-center rounded-full glass-panel hover:bg-white/10"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Review submission form ───────────────────────── */

function ReviewForm({ whatsappNumber, onSubmitted }: { whatsappNumber: string; onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");

  const reset = () => {
    setName(""); setLocation(""); setRating(5); setMessage(""); setPhoto(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // ── Anti-spam: honeypot + minimum dwell time
    if (honeypot.trim().length > 0) return;
    if (Date.now() - startedAt < 1000) {
      setErr("Please take a moment to fill the form.");
      return;
    }
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    if (trimmedName.length < 2) return setErr("Please enter your full name.");
    if (trimmedMsg.length < 10) return setErr("Please write at least 10 characters.");
    if (trimmedMsg.length > 2000) return setErr("Message is too long.");
    if (rating < 1 || rating > 5) return setErr("Please pick a rating.");

    try {
      setSubmitting(true);
      await submitReview({
        customer_name: trimmedName,
        location: location.trim(),
        rating,
        review_message: trimmedMsg,
        customer_photo: photo,
      });
      setDone(true);
      reset();
      onSubmitted();
      alert("Review submitted successfully! It will appear here once approved.");

      syncToGoogleSheets({
        data: {
          source: "review",
          data: {
            name: trimmedName,
            location: location.trim(),
            rating,
            message: trimmedMsg,
          }
        }
      }).catch(err => console.error("Sync failed:", err));

      // ── Direct WhatsApp message to the owner so they see it instantly
      const num = (whatsappNumber || "").replace(/\D/g, "");
      if (num) {
        const text = encodeURIComponent(
          `New review from ${trimmedName}${location ? ` (${location})` : ""} — ${rating}★\n\n"${trimmedMsg}"\n\nPlease approve in admin dashboard.`,
        );
        window.open(`https://wa.me/${num}?text=${text}`, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not submit review. Please try again.";
      setErr(msg);
      alert("Error: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-primary/20 text-primary">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your review has been received. It will appear here once our team approves it.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 rounded-full border border-border px-5 py-2 text-sm hover:bg-surface"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-7 space-y-4">
      <div>
        <h3 className="text-2xl font-semibold">Share your experience</h3>
        <p className="text-sm text-muted-foreground mt-1">Reviews appear after approval.</p>
      </div>

      {/* honeypot — hidden from users, bots fill it */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <input
        type="text"
        required
        maxLength={120}
        placeholder="Your name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full bg-background/40 border border-border px-5 py-3 text-sm focus:outline-none focus:border-primary"
      />
      <input
        type="text"
        maxLength={120}
        placeholder="Location (e.g. Mangalagiri)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full rounded-full bg-background/40 border border-border px-5 py-3 text-sm focus:outline-none focus:border-primary"
      />
      <div className="group relative">
        <input
          type="tel"
          required
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          title="Please enter exactly 10 digits"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
          }}
          className="w-full rounded-full bg-background/40 border border-border px-5 py-3 text-sm focus:outline-none focus:border-primary"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {phone.length}/10
        </div>
      </div>

      <div className="flex items-center gap-2 px-2">
        <span className="text-sm text-muted-foreground mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
            className="p-0.5"
          >
            <Star className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>

      <textarea
        required
        rows={4}
        minLength={10}
        maxLength={2000}
        placeholder="Tell us about your experience *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-2xl bg-background/40 border border-border px-5 py-3 text-sm focus:outline-none focus:border-primary resize-none"
      />

      <label className="block text-xs text-muted-foreground">
        Photo (optional)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-1.5 file:text-xs file:font-semibold"
        />
      </label>

      {err && <p className="text-xs text-destructive">{err}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
