import {desc, eq} from "drizzle-orm";
import {db} from "../db.server";
import {SeaCatchImages, SeaCatches} from "../records/sea-catches.server";

export function getSeaCatches() {
  let catches = db
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

export async function insertSeaCatch({
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
  let [{id}] = await db
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

export async function insertImage(id: number, image: string) {
  await db.insert(SeaCatchImages).values({image, catch_id: id});
}
