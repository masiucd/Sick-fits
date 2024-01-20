import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {z} from "zod";

export const SeaCatchSchema = z.object({
  id: z.number(),
  name: z.string(),
  species: z.string(),
  description: z.string(),
  price: z.number(),
  state: z.string(), // fresh or soldOut
  created_at: z.string(),
  image: z.string(),
});

export type SeaCatch = z.infer<typeof SeaCatchSchema>;
export const SeaCatchesSchema = z.array(SeaCatchSchema);

export const SeaCatches = sqliteTable("sea_catches", {
  id: integer("id"),
  name: text("name"),
  species: text("species"),
  description: text("description"),
  price: integer("price"),
  state: text("state"),
  created_at: text("created_at"),
});

export const SeaCatchImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

export type SeaCatchImage = z.infer<typeof SeaCatchImageSchema>;

export const SeaCatchImagesSchema = z.array(SeaCatchImageSchema);

export const SeaCatchImages = sqliteTable("sea_catch_images", {
  id: integer("id"),
  fish_id: integer("fish_id"),
  image: text("image"),
});

export const orders = sqliteTable("orders", {
  id: integer("id"),
  catch_id: integer("catch_id"),
  created_at: text("created_at"),
});
