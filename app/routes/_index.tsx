import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {db} from "~/db/db";
import {FishImagesSchema, FishesSchema, fishImages, fishes} from "~/db/fishes";
import {format, parseISO} from "date-fns";
import {asc, desc, eq} from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [
    {title: "Catch of today"},
    {name: "description", content: "Catch of today is a fish market app 🐟"},
  ];
};

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

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
    .insert(fishes)
    .values(newFish)
    .returning({id: fishes.id});
  if (id) {
    await db.insert(fishImages).values({image, fish_id: id});
  }

  return redirect("/", {
    headers: {
      // "Set-Cookie": `fishId=${name}; Max-Age=60; HttpOnly; Path=/`,
      "Cache-Control": "no-cache",
    },
  });
}

export async function loader({request, params}: LoaderFunctionArgs) {
  const fishItems = await db
    .select({
      id: fishes.id,
      name: fishes.name,
      species: fishes.species,
      description: fishes.description,
      price: fishes.price,
      state: fishes.state,
      created_at: fishes.created_at,
      image: fishImages.image,
    })
    .from(fishes)
    .innerJoin(fishImages, eq(fishes.id, fishImages.fish_id))
    .orderBy(desc(fishes.created_at));

  const images = await db
    .select({
      id: fishImages.id,
      image: fishImages.image,
    })
    .from(fishImages);

  const fishesItemsList = FishesSchema.parse(fishItems);
  const fishImagesList = FishImagesSchema.parse(images);

  return {
    fishes: fishesItemsList,
    fishImages: fishImagesList,
  };
}

export default function Index() {
  const {fishes, fishImages} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <section className="my-10 flex flex-1 flex-col">
      <div className="grid flex-1  grid-cols-1 md:grid-cols-12">
        <div className="col-span-4 border-2 border-gray-900">
          <h1>Welcome to catch of today</h1>
          <ul>
            {fishes.map((fish) => {
              return (
                <li key={fish.id}>
                  <h2>{fish.name}</h2>
                  <h2>
                    {fish.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h2>
                  <p>{fish.species}</p>
                  <p>{fish.description}</p>
                  <p>{format(parseISO(fish.created_at), "MMMM do, yyyy")}</p>

                  <img
                    src={`/images/${fish.image || fish.name}.jpg`}
                    alt={fish.name}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-3 border-2 border-gray-900 ">
          <h2 className="mb-5">Your order</h2>
          <div
            className="relative flex justify-between px-2
                py-3 before:absolute before:inset-0 before:z-[-1]  before:border-t-2 before:border-gray-900 before:content-['']
                after:absolute after:inset-0 after:bottom-[0] after:z-[-1]  after:w-full  after:border-b-2 after:border-gray-900 after:content-['']"
          >
            <span className="font-bold">Total:</span> <span>$0.00</span>
          </div>
        </div>
        <div className="col-span-5 border-2 border-gray-900">
          <h3>Inventory</h3>
          <fetcher.Form method="post">
            <fieldset className="flex flex-col gap-2">
              <div className="flex flex-col border-2 md:flex-row">
                <div className="flex flex-1 flex-col">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className="flex flex-1 flex-col">
                  <label htmlFor="species">Species</label>
                  <select name="species" id="species" required>
                    <option defaultChecked value="shell">
                      Shell
                    </option>
                    <option value="fish">Fish</option>
                    <option value="crab">Crab</option>
                    <option value="lobster">Lobster</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col border-2 md:flex-row">
                <div className="flex flex-1 gap-5">
                  <div>
                    <label htmlFor="fresh">Fresh</label>
                    <input
                      type="radio"
                      id="fresh"
                      name="state"
                      value="fresh"
                      defaultChecked
                    />
                  </div>

                  <div>
                    <label htmlFor="sold-out">Sold out</label>
                    <input
                      type="radio"
                      id="sold-out"
                      name="state"
                      value="sold-out"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="price">Price</label>
                  <input type="number" name="price" id="price" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" required />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="image">Image</label>

                  <select name="image" id="image">
                    {fishImages.map((fish) => (
                      <option key={fish.id} value={fish.image}>
                        {fish.image}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-700"
                type="submit"
              >
                Add catch
              </button>
            </fieldset>
          </fetcher.Form>
        </div>
      </div>
    </section>
  );
}
