import {db} from "~/db/db";
import {desc, eq} from "drizzle-orm";
import {SeaCatchImages, SeaCatches, orders} from "~/db/sea-catches";

export function getSeaCatches() {
  const catches = db
    .select({
      id: SeaCatches.id,
      name: SeaCatches.name,
      species: SeaCatches.species,
      description: SeaCatches.description,
      price: SeaCatches.price,
      state: SeaCatches.state,
      created_at: SeaCatches.created_at,
      image: SeaCatchImages.image,
    })
    .from(SeaCatches)
    .innerJoin(SeaCatchImages, eq(SeaCatches.id, SeaCatchImages.catch_id))
    .orderBy(desc(SeaCatches.created_at))
    .execute();
  return catches;
}

export async function getImages() {
  return await db
    .select({
      id: SeaCatchImages.id,
      image: SeaCatchImages.image,
    })
    .from(SeaCatchImages);
}

export async function insertCatch({
  name,
  species,
  description,
  state,
  price,
}: {
  name: string;
  species: string;
  description: string;
  state: string;
  price: string;
}) {
  const [{id}] = await db
    .insert(SeaCatches)
    .values({
      name,
      species,
      description,
      state,
      price: parseFloat(price),
      created_at: new Date().toISOString(),
    })
    .returning({id: SeaCatches.id});
  return id;
}

export async function insertIntoOrder(seaCathId: string) {
  await db.insert(orders).values({
    catch_id: parseInt(seaCathId, 10),
    created_at: new Date().toISOString(),
  });
}
