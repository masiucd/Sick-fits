import {db} from "../db.server";
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
