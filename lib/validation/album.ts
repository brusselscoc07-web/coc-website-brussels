import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only");

export const albumSchema = z.object({
  id: slug,
  title: z.string().trim().min(1, "Title is required").max(300),
  albumDate: z.string().min(1, "Date is required"),
});

export const photoSchema = z.object({
  caption: z.string().trim().max(300).optional(),
});
