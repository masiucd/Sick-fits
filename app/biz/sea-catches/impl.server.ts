import {insertIntoOrder} from "~/db/orders/dao.server";

export async function addToCart(seaCathId: number) {
  // In a real app, REDIS would be a better choice for this kind of thing
  return await insertIntoOrder(seaCathId);
}
