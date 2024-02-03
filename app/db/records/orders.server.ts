import {text, integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {z} from "zod";

let OrderItemSchema = z.object({
  id: z.number(),
  catch_id: z.number(),
  name: z.string(),
  price: z.number(),
  species: z.string(),
  description: z.string(),
});
export let OrdersSchema = z.array(OrderItemSchema);
export type OrderItem = z.infer<typeof OrderItemSchema>;

export let Orders = sqliteTable("orders", {
  id: integer("id"),
  catch_id: integer("catch_id"),
  created_at: text("created_at"),
});
