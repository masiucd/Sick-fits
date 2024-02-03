import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {z} from "zod";

export let SeaCatchSchema = z.object({
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
export let SeaCatchesSchema = z.array(SeaCatchSchema);

export let SeaCatches = sqliteTable("sea_catches", {
  id: integer("id"),
  name: text("name"),
  species: text("species"),
  description: text("description"),
  price: integer("price"),
  state: text("state"),
  created_at: text("created_at"),
});

export let SeaCatchImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

export type SeaCatchImage = z.infer<typeof SeaCatchImageSchema>;

export let SeaCatchImagesSchema = z.array(SeaCatchImageSchema);

export let SeaCatchImages = sqliteTable("sea_catch_images", {
  id: integer("id"),
  catch_id: integer("catch_id"),
  image: text("image"),
});
