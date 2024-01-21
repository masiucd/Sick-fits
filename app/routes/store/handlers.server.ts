import {redirect} from "@remix-run/node";
import {insertCatch, insertIntoOrder} from "./db.server";
import {SeaCatchImages} from "~/db/sea-catches";
import {db} from "~/db/db";

export async function addToCart(seaCathId: string, pathname: string) {
  // In a real app, REDIS would be a better choice for this kind of thing
  await insertIntoOrder(seaCathId);

  return redirect(pathname, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
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
  const id = await insertCatch({
    name,
    species,
    description,
    state,
    price,
  });
  if (id) {
    await db.insert(SeaCatchImages).values({image, catch_id: id});
  }

  // return redirect("/store", {
  //   headers: {
  //     "Cache-Control": "no-cache",
  //   },

  // });
  return id;
}
