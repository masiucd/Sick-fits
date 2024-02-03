import {type ActionFunctionArgs, type MetaFunction} from "@remix-run/node";
import {Outlet, useLoaderData} from "@remix-run/react";
import Orders from "./orders";
import {
  SeaCatchImageSchema,
  SeaCatchSchema,
} from "~/db/records/sea-catches.server";
import {SeaCatchesSection} from "./catches";
import {Inventory} from "./inventory";
import {
  addCatch,
  addToCart,
  getImages,
  getSeaCatches,
} from "~/biz/sea-catches/impl.server";

export let meta: MetaFunction = () => {
  return [
    {title: "SeaCatch of today"},
    {name: "description", content: "SeaCatch of today is a fish market app 🐟"},
  ];
};

export async function action({request}: ActionFunctionArgs) {
  let formData = await request.formData();
  let action = formData.get("_action");

  if (action === "add-to-cart") {
    let seaCathId = formData.get("sea-catch-id");
    if (typeof seaCathId !== "string") {
      return new Response("Invalid form data", {status: 400});
    }
    return await addToCart(Number(seaCathId));
  } else {
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
