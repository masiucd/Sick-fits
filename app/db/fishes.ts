import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {z} from "zod";

export const FishSchema = z.object({
  id: z.number(),
  name: z.string(),
  species: z.string(),
  description: z.string(),
  image: z.string(),
});

export type Fish = z.infer<typeof FishSchema>;
export const FishesSchema = z.array(FishSchema);

export const fishes = sqliteTable("fishes", {
  id: integer("id"),
  name: text("name"),
  species: text("species"),
  description: text("description"),
  image: text("image"),
  // textModifiers: text("text_modifiers")
  //   .notNull()
  //   .default(sql`CURRENT_TIMESTAMP`),
  // intModifiers: integer("int_modifiers", {mode: "boolean"})
  //   .notNull()
  //   .default(false),
});
