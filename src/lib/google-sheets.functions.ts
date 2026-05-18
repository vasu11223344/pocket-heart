import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SyncSchema = z.object({
  source: z.enum(["contact", "quote", "review"]),
  data: z.record(z.any()),
});

/**
 * Syncs submission data to Google Sheets via a Webhook (Google Apps Script).
 * Fails gracefully if the webhook URL is not configured.
 */
export const syncToGoogleSheets = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SyncSchema.parse(input))
  .handler(async ({ data: { source, data } }) => {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL not configured. Skipping Google Sheets sync.");
      return { success: false, reason: "NOT_CONFIGURED" };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Sheets responded with ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });
