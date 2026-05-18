import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useLocation } from "@tanstack/react-router";

export function WhatsAppButton() {
  const settings = useSettings();
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  const raw = settings?.whatsapp_number || settings?.contact_phone || "919652847145";
  const number = raw.replace(/\D/g, "");
  const withCC = number.startsWith("91") ? number : `91${number}`;
  const message = "Hi Green Spark Solar! I'd like to know more about your solar solutions and get a free quote.";
  const href = `https://wa.me/${withCC}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/40 transition hover:scale-110"
    >
      <MessageCircle className="h-6 w-6 fill-white" />
    </a>
  );
}
