import { useEffect, useState } from "react";
import { getSettings, type SiteSettings } from "@/integrations/pocketbase/services";

export type { SiteSettings } from "@/integrations/pocketbase/services";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    getSettings().then((s) => setSettings(s)).catch(() => setSettings(null));
  }, []);
  return settings;
}
