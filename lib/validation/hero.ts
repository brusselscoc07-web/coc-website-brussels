import { z } from "zod";

export const heroSlideSchema = z.object({
  headline: z.string().trim().min(1, "Headline is required").max(200),
  sub: z.string().trim().max(300).optional(),
});
