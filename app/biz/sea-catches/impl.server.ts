import {insertIntoOrder} from "~/db/orders/dao.server";
import {
  getImages as getImagesDao,
  getSeaCatches as getSeaCatchesDao,
  insertImage,
  insertSeaCatch,
} from "~/db/sea-catches/dao.server";

export async function addToCart(seaCathId: number) {
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
  let id = await insertSeaCatch({
    name,
    species,
    description,
    state,
    price,
  });

  if (!id) {
    throw new Error("Failed to insert sea catch");
  }
  await insertImage(id, image);
}

export async function getSeaCatches() {
  return await getSeaCatchesDao();
}

export async function getImages() {
  return await getImagesDao();
}
