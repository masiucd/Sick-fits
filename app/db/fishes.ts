import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {z} from "zod";

export const FishSchema = z.object({
  id: z.number(),
  name: z.string(),
  species: z.string(),
  description: z.string(),
  price: z.number(),
  state: z.string(), // fresh or soldOut
  created_at: z.string(),
  image: z.string(),
});

export type Fish = z.infer<typeof FishSchema>;
export const FishesSchema = z.array(FishSchema);

export const fishes = sqliteTable("fishes", {
  id: integer("id"),
  name: text("name"),
  species: text("species"),
  description: text("description"),
  price: integer("price"),
  state: text("state"),
  created_at: text("created_at"),
});

export const FishImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

export type FishImage = z.infer<typeof FishImageSchema>;

export const FishImagesSchema = z.array(FishImageSchema);

export const fishImages = sqliteTable("fish_images", {
  id: integer("id"),
  fish_id: integer("fish_id"),
  image: text("image"),
});
