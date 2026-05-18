import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listGallery } from "@/integrations/pocketbase/services";
import { SectionTag } from "@/components/SectionTag";
import { motion } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Green Spark Solar" },
      { name: "description", content: "Photos from our recent residential, commercial and farm solar installations." },
      { property: "og:title", content: "Gallery — Green Spark Solar" },
      { property: "og:description", content: "Recent solar installations across Andhra Pradesh." },
    ],
  }),
  component: GalleryPage,
});

interface Img { id: string; image_url: string; caption: string | null }

function GalleryPage() {
  const [items, setItems] = useState<Img[]>([]);
  useEffect(() => {
    listGallery({ onlyPublished: true })
      .then((d) => setItems(d as unknown as Img[]))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag>Gallery</SectionTag>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-display text-4xl md:text-6xl max-w-3xl"
        >
          Real installations, real savings.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-muted-foreground"
        >
          Solar systems we've installed across Mangalagiri, Addanki, and surrounding districts.
        </motion.p>

        {items.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
            Gallery photos will appear here soon.
          </div>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((img, i) => (
              <motion.figure 
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl overflow-hidden border border-border bg-card"
              >
                <img src={img.image_url} alt={img.caption || "Solar installation"} loading="lazy" className="w-full aspect-[4/3] object-cover transition group-hover:scale-105" />
                {img.caption && <figcaption className="p-4 text-sm text-muted-foreground">{img.caption}</figcaption>}
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
