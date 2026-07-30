import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only");

export const eventSchema = z.object({
  id: slug,
  title: z.string().trim().min(1, "Title is required").max(300),
  eventDate: z.string().min(1, "Date is required"),
  dateLabel: z.string().trim().max(200).optional(),
  eventTime: z.string().trim().min(1, "Time is required").max(100),
  description: z.string().trim().max(5000).optional(),
  location: z.string().trim().max(300).optional(),
});
