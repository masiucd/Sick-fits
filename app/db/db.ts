import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// id serial primary key,
// name text,
// species text,
// description text,
// image text
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
