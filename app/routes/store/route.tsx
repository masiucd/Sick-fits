import {
  redirect,
  defer,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {Await, Outlet, useLoaderData} from "@remix-run/react";
import {db} from "~/db/db";
import Orders from "./orders";
import {
  SeaCatchImages,
  SeaCatchImagesSchema,
  SeaCatches,
  SeaCatchesSchema,
  orders,
} from "~/db/sea-catches";
import {Suspense} from "react";
import {getImages, getSeaCatches} from "./db.server";
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
    const x = request.url.split("/").at(-1);
    console.log('request.url.split("/")', request.url.split("/"));
    console.log("🚀 ~ action ~ x:", x);
    return redirect("/store", {
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

    return redirect("/store", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }
}

async function sleep(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loader() {
  const catches = getSeaCatches(); // streaming data
  await sleep();
  return defer({
    SeaCatches: catches,
    SeaCatchImages: SeaCatchImagesSchema.parse(await getImages()),
  });
}

export default function Stores() {
  const {SeaCatches, SeaCatchImages} = useLoaderData<typeof loader>();
  return (
    <section className="my-10 flex flex-1 flex-col ">
      <div className="grid  flex-1  grid-cols-1 md:grid-cols-12">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={SeaCatches}>
            {(s) => (
              <SeaCatchesSection SeaCatches={SeaCatchesSchema.parse(s)} />
            )}
          </Await>
        </Suspense>
        <Orders>
          <Outlet />
        </Orders>
        <Inventory SeaCatchImages={SeaCatchImages} />
      </div>
    </section>
  );
}
