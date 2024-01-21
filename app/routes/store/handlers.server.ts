import {insertCatch, insertIntoOrder} from "./db.server";
import {SeaCatchImages} from "~/db/sea-catches";
import {db} from "~/db/db";

export async function addToCart(seaCathId: string) {
  // In a real app, REDIS would be a better choice for this kind of thing
  return await insertIntoOrder(seaCathId);
}

export async function addCatch({
  name,
  species,
  description,
  image,
  state,
  price,
}: {
  name: string;
  species: string;
  description: string;
  image: string;
  state: string;
  price: string;
}) {
  const id = await insertCatch({
    name,
    species,
    description,
    state,
    price,
  });
  if (id) {
    await db.insert(SeaCatchImages).values({image, catch_id: id});
  }
  return id;
}
