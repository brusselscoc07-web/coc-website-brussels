import { z } from "zod";

export const commentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.union([z.email(), z.literal("")]).optional(),
  text: z.string().trim().min(1, "Comment is required").max(2000, "Comment is too long"),
});
