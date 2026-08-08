import { z } from "zod";

export const commentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("A valid email is required"),
  text: z.string().trim().min(1, "Comment or question is required").max(2000, "Comment is too long"),
});
