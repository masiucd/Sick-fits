import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {useFetcher} from "@remix-run/react";
import {db} from "~/db/db";
import {FishesSchema, fishes} from "~/db/fishes";

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
  if (
    typeof name !== "string" ||
    typeof species !== "string" ||
    typeof description !== "string" ||
    typeof image !== "string" ||
    typeof state !== "string"
  ) {
    return new Response("Invalid form data", {status: 400});
  }

  const newFish = {
    name,
    species,
    description,
    image,
    state,
  };
  console.log("newFish", newFish);
  await db.insert(fishes).values(newFish);
  return null;
}

export async function loader({request, params}: LoaderFunctionArgs) {
  const rows = await db
    .select({
      id: fishes.id,
      name: fishes.name,
      species: fishes.species,
      description: fishes.description,
      image: fishes.image,
      state: fishes.state,
    })
    .from(fishes);
  return FishesSchema.parse(rows);
}

export default function Index() {
  // const fishes = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <section className="my-10 flex flex-1 flex-col">
      <div className="grid flex-1  grid-cols-1 md:grid-cols-12">
        <div className="col-span-4 border-2 border-gray-900">
          <h1>Welcome to catch of today</h1>
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
              <div className="flex">
                <div className="flex flex-col">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className="flex flex-col">
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

                <div className="flex gap-5">
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
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" required />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="image">Image</label>
                  <input type="text" id="image" name="image" />
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

      {/* <ul className="grid grid-cols-3 gap-4">
        {fishes.map((fish) => {
          console.log("fish.image", fish.image);
          return (
            <li key={fish.id}>
              <h2>{fish.name}</h2>
              <p>{fish.species}</p>
              <p>{fish.description}</p>
              <img
                src={`/images/${fish.image || fish.name}.jpg`}
                alt={fish.name}
              />
            </li>
          );
        })}
      </ul> */}
    </section>
  );
}
