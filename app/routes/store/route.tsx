import {type ActionFunctionArgs, type MetaFunction} from "@remix-run/node";
import {Outlet, useLoaderData} from "@remix-run/react";
import Orders from "./orders";
import {
  SeaCatchImageSchema,
  SeaCatchImages,
  SeaCatchSchema,
  SeaCatches,
} from "~/db/records/sea-catches.server";
import {SeaCatchesSection} from "./catches";
import {Inventory} from "./inventory";
import {addToCart} from "~/biz/sea-catches/impl.server";
import {db} from "~/db/db.server";
import {desc, eq} from "drizzle-orm";
import {insertImage} from "~/db/sea-catches/dao.server";

export let meta: MetaFunction = () => {
  return [
    {title: "SeaCatch of today"},
    {name: "description", content: "SeaCatch of today is a fish market app 🐟"},
  ];
};

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

export async function action({request}: ActionFunctionArgs) {
  let formData = await request.formData();
  let action = formData.get("_action");
  if (action === "remove-sea-catch") {
    let seaCatchId = formData.get("sea-catch-id");
    if (typeof seaCatchId !== "string") {
      return new Response("Invalid form data", {status: 400});
    }
    await db
      .delete(SeaCatches)
      .where(eq(SeaCatches.id, Number(seaCatchId)))
      .execute();
  }
  if (action === "update-sea-catch") {
    let seaCatchId = formData.get("sea-catch-id");
    if (typeof seaCatchId !== "string") {
      return new Response("Invalid form data", {status: 400});
    }
    let data = Object.fromEntries(formData.entries());
    await db
      .update(SeaCatches)
      .set({
        name: String(data.name),
        species: String(data.species),
        description: String(data.description),
        state: String(data.state),
        price: parseFloat(String(data.price)),
      })
      .where(eq(SeaCatches.id, Number(seaCatchId)));
    return new Response(null, {status: 303, headers: {Location: "/store"}});
  }
  if (action === "add-sea-catch") {
    let name = formData.get("name");
    let species = formData.get("species");
    let description = formData.get("description");
    let image = formData.get("image");
    let state = formData.get("state");
    let price = formData.get("price");
    if (
      typeof name !== "string" ||
      typeof species !== "string" ||
      typeof description !== "string" ||
      typeof image !== "string" ||
      typeof state !== "string" ||
      typeof price !== "string"
    ) {
      return new Response("Invalid form data", {status: 400});
    }
    return await addCatch({
      name,
      species,
      description,
      image,
      state,
      price,
    });
  }

  if (action === "add-to-cart") {
    let seaCathId = formData.get("sea-catch-id");
    if (typeof seaCathId !== "string") {
      return new Response("Invalid form data", {status: 400});
    }
    return await addToCart(Number(seaCathId));
  }
  return new Response("Unknown action", {status: 400});
}

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

export async function loader() {
  return {
    seaCatchImages: SeaCatchImageSchema.array().parse(await getImages()),
    seaCatches: SeaCatchSchema.array().parse(await getSeaCatches()),
  };
}

export default function Stores() {
  let {seaCatches, seaCatchImages} = useLoaderData<typeof loader>();
  return (
    <section className="my-10 flex flex-1 flex-col ">
      <div className="grid flex-1 grid-cols-1 md:grid-cols-12">
        <SeaCatchesSection seaCatches={seaCatches} />
        <Orders>
          <Outlet />
        </Orders>
        <Inventory seaCatches={seaCatches} seaCatchImages={seaCatchImages} />
      </div>
    </section>
  );
}
