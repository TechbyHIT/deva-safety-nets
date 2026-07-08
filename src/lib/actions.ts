"use server";

import { z } from "zod";
import type { LeadState } from "./lead-types";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s-]{7,15}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.string().trim().max(200).optional().or(z.literal("")),
  company: z.string().max(0).optional(),
});

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = LeadSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0])] = issue.message;
    }
    return { ok: false, message: "Please correct the highlighted fields.", errors };
  }

  const data = parsed.data;

  if (data.company && data.company.length > 0) {
    return { ok: true, message: "Thank you! We'll be in touch shortly." };
  }

  return {
    ok: true,
    message: "Thank you! Our team will contact you within 24 hours for your free site survey.",
  };
}
