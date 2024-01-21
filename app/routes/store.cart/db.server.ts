import {eq, desc} from "drizzle-orm";
import {db} from "~/db/db";
import {SeaCatches, orders} from "~/db/sea-catches";

export async function getOrderItems() {
  return await db
    .select({
      id: orders.id,
      catch_id: orders.catch_id,
      name: SeaCatches.name,
      price: SeaCatches.price,
      species: SeaCatches.species,
      description: SeaCatches.description,
    })
    .from(orders)
    .innerJoin(SeaCatches, eq(orders.catch_id, SeaCatches.id))
    .orderBy(desc(SeaCatches.created_at));
}
