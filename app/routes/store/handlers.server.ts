import {desc, eq} from "drizzle-orm";
import {db} from "~/db/db.server";
import {Orders} from "~/db/records/orders.server";
import {SeaCatchImages, SeaCatches} from "~/db/records/sea-catches.server";

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

export async function getImages() {
  return await db
    .select({
      id: SeaCatchImages.id,
      image: SeaCatchImages.image,
    })
    .from(SeaCatchImages);
}

export async function handleAction(
  action: FormDataEntryValue | null,
  formData: FormData,
) {
  switch (action) {
    case "remove-sea-catch": {
      let seaCatchId = formData.get("sea-catch-id");
      if (typeof seaCatchId !== "string") {
        return new Response("Invalid form data", {status: 400});
      }
      return await removeSeaCatch(Number(seaCatchId));
    }
    case "update-sea-catch": {
      let seaCatchId = formData.get("sea-catch-id");
      if (typeof seaCatchId !== "string") {
        return new Response("Invalid form data", {status: 400});
      }
      let data = Object.fromEntries(formData.entries());
      let record = {
        name: String(data.name),
        species: String(data.species),
        description: String(data.description),
        state: String(data.state),
        price: parseFloat(String(data.price)),
      };

      await updateCatch(record, Number(seaCatchId));
      return new Response(null, {status: 303, headers: {Location: "/store"}});
    }
    case "add-sea-catch": {
      let data = Object.fromEntries(formData.entries());
      if (
        typeof data.name !== "string" ||
        typeof data.species !== "string" ||
        typeof data.description !== "string" ||
        typeof data.image !== "string" ||
        typeof data.state !== "string" ||
        typeof data.price !== "string"
      ) {
        return new Response("Invalid form data", {status: 400});
      }
      return await addCatch({
        name: data.name,
        species: data.species,
        description: data.description,
        image: data.image,
        state: data.state,
        price: parseFloat(data.price),
      });
    }
    case "add-to-cart": {
      let seaCathId = formData.get("sea-catch-id");
      if (typeof seaCathId !== "string") {
        return new Response("Invalid form data", {status: 400});
      }
      return await insertInToOrder(Number(seaCathId));
    }
    default:
      return new Response("Unknown action", {status: 400});
  }
}

async function insertImage(id: number, image: string) {
  await db.insert(SeaCatchImages).values({image, catch_id: id});
}

async function addCatch({
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
  price: number;
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

async function insertInToOrder(seaCathId: number) {
  return await db
    .insert(Orders)
    .values({
      catch_id: seaCathId,
      created_at: new Date().toISOString(),
    })
    .returning({id: Orders.id});
}

async function insertSeaCatch({
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
  price: number;
}) {
  let [{id}] = await db
    .insert(SeaCatches)
    .values({
      name,
      species,
      description,
      state,
      price: price,
      created_at: new Date().toISOString(),
    })
    .returning({id: SeaCatches.id});
  return id;
}

async function updateCatch(
  record: {
    name: string;
    species: string;
    description: string;
    state: string;
    price: number;
  },
  seaCatchId: number,
) {
  await db
    .update(SeaCatches)
    .set({
      name: record.name,
      species: record.species,
      description: record.description,
      state: record.state,
      price: record.price,
    })
    .where(eq(SeaCatches.id, seaCatchId));
}

async function removeSeaCatch(id: number) {
  await db.delete(SeaCatches).where(eq(SeaCatches.id, id)).execute();
  return true;
}
