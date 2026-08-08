import { z } from "zod";

const worshipItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "Label is required").max(100),
});

export const aboutSchema = z.object({
  statement: z.string().trim().min(1, "Statement is required").max(2000),
  planOfSalvation: z.string().trim().min(1, "Plan of Salvation is required").max(2000),
  worshipItems: z.array(worshipItemSchema).max(20),
  worshipPlace: z.string().trim().min(1, "Worship place is required").max(200),
  preacher: z.string().trim().min(1, "Preacher is required").max(200),
  preacherBio: z.string().trim().min(1, "Preacher bio is required").max(2000),
  zoomLink: z.union([z.url(), z.literal("")]),
  zoomNote: z.string().trim().max(200),
});
