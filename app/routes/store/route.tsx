import {
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {Outlet, useLoaderData} from "@remix-run/react";
import {db} from "~/db/db";
import {desc, eq} from "drizzle-orm";
import Orders from "./orders";
import {
  SeaCatchImages,
  SeaCatchImagesSchema,
  SeaCatches,
  SeaCatchesSchema,
  orders,
} from "~/db/sea-catches";
import {SeaCatchesSection} from "./catches";
import {Inventory} from "./inventory";

export const meta: MetaFunction = () => {
  return [
    {title: "SeaCatch of today"},
    {name: "description", content: "SeaCatch of today is a fish market app 🐟"},
  ];
};

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "add-to-cart") {
    const seaCathId = formData.get("sea-catch-id");
    if (typeof seaCathId !== "string") {
      return new Response("Invalid form data", {status: 400});
    }

    await db.insert(orders).values({
      catch_id: parseInt(seaCathId, 10),
      created_at: new Date().toISOString(),
    });
    return redirect("/", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  } else {
    const name = formData.get("name");
    const species = formData.get("species");
    const description = formData.get("description");
    const image = formData.get("image");
    const state = formData.get("state");
    const price = formData.get("price");
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

    const newFish = {
      name,
      species,
      description,
      state,
      price: parseFloat(price),
      created_at: new Date().toISOString(),
    };

    const [{id}] = await db
      .insert(SeaCatches)
      .values(newFish)
      .returning({id: SeaCatches.id});
    if (id) {
      await db.insert(SeaCatchImages).values({image, fish_id: id});
    }

    return redirect("/", {
      headers: {
        // "Set-Cookie": `fishId=${name}; Max-Age=60; HttpOnly; Path=/`,
        "Cache-Control": "no-cache",
      },
    });
  }
}

export async function loader() {
  const fishItems = await db
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
    .orderBy(desc(SeaCatches.created_at));

  const images = await db
    .select({
      id: SeaCatchImages.id,
      image: SeaCatchImages.image,
    })
    .from(SeaCatchImages);

  const fishesItemsList = SeaCatchesSchema.parse(fishItems);
  const SeaCatchImagesList = SeaCatchImagesSchema.parse(images);

  return {
    SeaCatches: fishesItemsList,
    SeaCatchImages: SeaCatchImagesList,
  };
}

export default function Stores() {
  const {SeaCatches, SeaCatchImages} = useLoaderData<typeof loader>();

  return (
    <section className="my-10 flex flex-1 flex-col ">
      <div className="grid  flex-1  grid-cols-1 md:grid-cols-12">
        <SeaCatchesSection SeaCatches={SeaCatches} />
        <Orders>
          <Outlet />
        </Orders>
        <Inventory SeaCatchImages={SeaCatchImages} />
      </div>
    </section>
  );
}
