import {desc, eq} from "drizzle-orm";
import {db} from "~/db/db";
import {SeaCatches, orders} from "~/db/sea-catches";

export async function loader() {
  // select o.id, o.catch_id, sc.name, sc.price, sc.species, sc.description
  // from orders o
  //          inner join sea_catches sc on o.catch_id = sc.id;
  const orderItems = await db
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

  console.log("orderItems", orderItems);
  return [];
}

export default function Cart() {
  return <div>Cart</div>;
}
