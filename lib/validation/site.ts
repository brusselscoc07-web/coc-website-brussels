import { z } from "zod";
import { CHURCH_TIMEZONES } from "@/lib/timezone";

const timeValueSchema = z.object({
  hour: z.number().int().min(1).max(12),
  minute: z.number().int().min(0).max(59),
  period: z.enum(["AM", "PM"]),
});

const serviceTimeSchema = z.object({
  id: z.string().min(1),
  day: z.string().trim().min(1, "Day is required").max(50),
  start: timeValueSchema,
  end: timeValueSchema.nullable().optional(),
});

const socialLinkSchema = z.object({
  key: z.enum(["youtube", "facebook", "instagram", "whatsapp"]),
  label: z.string().trim().max(50),
  handle: z.string().trim().max(200),
  url: z.union([z.url(), z.literal("")]),
  note: z.string().trim().max(200),
});

const timezoneValues = CHURCH_TIMEZONES.map((t) => t.value) as [string, ...string[]];

export const siteSettingsSchema = z.object({
  address: z.string().trim().min(1, "Address is required").max(300),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-\s]*$/, "Phone can only contain numbers, spaces, + and -"),
  hours: z.string().trim().max(200),
  tagline: z.string().trim().max(300),
  email: z.union([z.email(), z.literal("")]),
  timezone: z.enum(timezoneValues),
  serviceTimes: z.array(serviceTimeSchema).max(10),
  socialLinks: z.array(socialLinkSchema).max(10),
});
