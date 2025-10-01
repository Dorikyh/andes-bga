// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const actividades = defineCollection({
  schema: z.object({
    title: z.string(),
    start: z.string(),        // ISO: 2025-10-10T15:00:00
    end: z.string().optional(),
    location: z.string().optional(),
    coords: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    image: z.string().optional(),
    published: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional()
  })
});

export const collections = {
  actividades
};
