import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listProjects } from "@/integrations/pocketbase/services";
import { SectionTag } from "@/components/SectionTag";
import { motion } from "framer-motion";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Green Spark Solar" },
      { name: "description", content: "Selected solar installations across homes, farms and communities." },
    ],
  }),
  component: ProjectsPage,
});

interface Project {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  year: string | null;
}

function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProjects({ onlyPublished: true })
      .then((d) => {
        setItems(d as unknown as Project[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag>Selected Work</SectionTag>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-display text-5xl md:text-7xl max-w-4xl"
        >
          Recent solar installations & case studies.
        </motion.h1>

        {loading ? (
          <p className="mt-16 text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No projects published yet.</p>
            <p className="mt-2 text-xs text-muted-foreground">Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {items.map((p, i) => (
              <motion.article 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group rounded-3xl overflow-hidden border border-border bg-card ${i % 2 ? "md:translate-y-12" : ""}`}
              >
                {p.image_url && (
                  <div className="overflow-hidden">
                    <img src={p.image_url} alt={p.title} loading="lazy" className="w-full aspect-[4/3] object-cover transition group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-primary">{p.category}</div>
                      <h3 className="mt-1 text-2xl font-semibold">{p.title}</h3>
                    </div>
                    {p.year && <div className="text-muted-foreground">{p.year}</div>}
                  </div>
                  {p.description && <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
