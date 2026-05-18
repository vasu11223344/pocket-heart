import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

async function fetchSettings(): Promise<Record<string, unknown>> {
  const url = process.env.VITE_POCKETBASE_URL || process.env.POCKETBASE_URL;
  if (!url) return {};
  try {
    const res = await fetch(
      `${url.replace(/\/$/, "")}/api/collections/site_settings/records?perPage=1&sort=-created`,
    );
    if (!res.ok) return {};
    const json = (await res.json()) as { items?: Array<Record<string, unknown>> };
    return json.items?.[0] ?? {};
  } catch {
    return {};
  }
}

function buildSystemPrompt(s: Record<string, unknown>): string {
  return `You are the friendly customer support assistant for Green Spark Solar, a solar installation company in Andhra Pradesh, India.

Company info:
- Services: residential rooftop solar, commercial solar plants, farm/agricultural solar, battery storage.
- Brands used: Tata Power Solar, Adani Solar, Waaree, Vikram Solar, Loom Solar.
- We handle the COMPLETE PM Surya Ghar subsidy and bank loan paperwork.
- 25-year warranty on solar panels. MNRE-approved systems.

PM Surya Ghar subsidy (India):
- 1 kW system: ₹30,000 subsidy
- 2 kW system: ₹60,000 subsidy
- 3 kW to 10 kW system: ₹78,000 subsidy (capped)

Pricing reference: ~₹70,000 per kW installed (3 kW ≈ ₹2,10,000 before subsidy). Confirm exact pricing during free site visit.

Generation: ~120 units/month per kW. At ₹7/unit, a 3 kW system saves ~₹2,520/month.

Contact:
- Phone: ${s.contact_phone || "9652847145"} / ${s.phone_secondary || "9100864364"} / ${s.phone_tertiary || "6302021671"}
- Email: ${s.contact_email || "greensparksolar11@gmail.com"}
- WhatsApp: +${s.whatsapp_number || "919652847145"}
- Head office: ${s.address_head_office || "Mangalagiri, Guntur Dist., A.P."}
- Branch: ${s.address_branch_office || "Addanki, Prakasam Dist., A.P."}
- Branches: ${s.branches_list || "Prakasam | Bapatla | Palanadu"}

Rules:
- Keep replies short, helpful, and friendly.
- If the customer wants a quote or installation, ask for their location, monthly bill, and phone number, and direct them to the contact form or WhatsApp.
- For technical or pricing questions, give a clear estimate and recommend a free site visit.
- If asked something unrelated to solar/Green Spark, politely steer back.
- Use INR (₹) for prices.`;
}

export const chatStream = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatSchema.parse(input))
  .handler(async function* ({ data }) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      yield { delta: "AI is not configured. Please contact us directly via WhatsApp." };
      return;
    }
    const settings = await fetchSettings();
    const system = buildSystemPrompt(settings);

    let endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
    let modelName = "google/gemini-2.5-flash";

    if (process.env.GEMINI_API_KEY) {
      endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      modelName = "gemini-2.5-flash";
    } else if (process.env.OPENAI_API_KEY) {
      endpoint = "https://api.openai.com/v1/chat/completions";
      modelName = "gpt-4o-mini";
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        stream: true,
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      yield { delta: `Sorry, I'm having trouble right now (${upstream.status}). Please WhatsApp us. ${text.slice(0, 100)}` };
      return;
    }

    const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              yield { delta };
            }
          } catch {
            /* ignore */
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  });

const ScanBillSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

export const scanBill = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ScanBillSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured. Please add GEMINI_API_KEY to your .env");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Extract the total electricity bill amount from this image. 
Return ONLY the exact numeric value (e.g., 3450).
If there are multiple amounts, pick the "total amount payable" or similar.
Do not include commas, currency symbols, or any other text.
If you cannot find a clear bill amount, return "0".`;

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: data.mimeType, data: data.imageBase64 } }
          ]
        }]
      })
    });

    if (!upstream.ok) {
      throw new Error("Failed to analyze image with AI.");
    }

    const json = (await upstream.json()) as any;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "0";
    const amount = parseInt(text.replace(/[^0-9]/g, ""), 10);
    return isNaN(amount) ? 0 : amount;
  });
