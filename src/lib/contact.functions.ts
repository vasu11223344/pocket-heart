/**
 * Contact form submission — writes directly to PocketBase from the client.
 * Kept as a thin server function for shared validation, but PocketBase
 * is reachable from the browser too — see services.submitContact.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { syncToGoogleSheets } from "./google-sheets.functions";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(2000),
  source: z.string().optional().default("contact"),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.VITE_POCKETBASE_URL || process.env.POCKETBASE_URL;
    if (!url) throw new Error("VITE_POCKETBASE_URL is not configured");

    const res = await fetch(`${url.replace(/\/$/, "")}/api/collections/submissions/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        message: data.message,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`PocketBase ${res.status}: ${text.slice(0, 200)}`);
    }

    // Background sync to Google Sheets
    syncToGoogleSheets({ 
      data: { 
        source: data.source as "contact" | "quote", 
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message
        }
      } 
    }).catch(err => console.error("Sync failed:", err));

    return { ok: true };
  });
