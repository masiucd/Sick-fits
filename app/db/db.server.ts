import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

let sqlite = new Database("sqlite.db");
export let db = drizzle(sqlite);
