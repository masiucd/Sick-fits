import {db} from "~/db/db";
import {desc, eq} from "drizzle-orm";
import {SeaCatchImages, SeaCatches} from "~/db/sea-catches";

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
    .innerJoin(SeaCatchImages, eq(SeaCatches.id, SeaCatchImages.fish_id))
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
