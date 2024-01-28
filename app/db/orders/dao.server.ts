import {desc, eq} from "drizzle-orm";
import {db} from "../db.server";
import {SeaCatches} from "../records/sea-catches.server";
import {Orders} from "../records/orders.server";

export async function insertIntoOrder(seaCathId: number) {
  return await db
    .insert(Orders)
    .values({
      catch_id: seaCathId,
      created_at: new Date().toISOString(),
    })
    .returning({id: Orders.id});
}

export async function deleteOrder(cartItemId: number) {
  await db.delete(Orders).where(eq(Orders.id, cartItemId));
}

export async function getOrderItems() {
  return await db
    .select({
      id: Orders.id,
      catch_id: Orders.catch_id,
      name: SeaCatches.name,
      price: SeaCatches.price,
      species: SeaCatches.species,
      description: SeaCatches.description,
    })
    .from(Orders)
    .innerJoin(SeaCatches, eq(Orders.catch_id, SeaCatches.id))
    .orderBy(desc(SeaCatches.created_at));
}
