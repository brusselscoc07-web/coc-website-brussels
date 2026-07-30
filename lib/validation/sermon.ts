import { z } from "zod";

export const SERMON_CATEGORIES = ["Sermon", "Thought for the Week", "Bible Teachings"] as const;

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only");

export const sermonSchema = z.object({
  id: slug,
  title: z.string().trim().min(1, "Title is required").max(300),
  date: z.string().min(1, "Date is required"),
  preacher: z.string().trim().min(1, "Preacher is required").max(200),
  scripture: z.string().trim().max(200).optional(),
  category: z.enum(SERMON_CATEGORIES),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().trim().min(1, "Body is required").max(20000),
  hasVideo: z.boolean().optional(),
  videoUrl: z.union([z.url(), z.literal("")]).optional(),
});
