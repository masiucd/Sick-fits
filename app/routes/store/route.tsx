import {
  defer,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {Await, Outlet, useLoaderData} from "@remix-run/react";
import Orders from "./orders";
import {SeaCatchImagesSchema, SeaCatchesSchema} from "~/db/sea-catches";
import {Suspense} from "react";
import {getImages, getSeaCatches} from "./db.server";
import {SeaCatchesSection} from "./catches";
import {Inventory} from "./inventory";
import {addCatch, addToCart} from "./handlers.server";

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
    const pathname = formData.get("pathname");
    if (typeof seaCathId !== "string" || typeof pathname !== "string") {
      return new Response("Invalid form data", {status: 400});
    }
    return await addToCart(seaCathId, pathname);
    // // In a real app, REDIS would be a better choice for this kind of thing
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
    return await addCatch({
      name,
      species,
      description,
      image,
      state,
      price,
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
