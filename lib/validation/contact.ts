import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
