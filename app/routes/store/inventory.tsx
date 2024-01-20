import {useFetcher} from "@remix-run/react";
import {type SeaCatchImage} from "~/db/sea-catches";

export function Inventory({SeaCatchImages}: {SeaCatchImages: SeaCatchImage[]}) {
  return (
    <div className="col-span-5 border-2 border-gray-900">
      <h3>Inventory</h3>
      <InventoryForm SeaCatchImages={SeaCatchImages} />
    </div>
  );
}

function InventoryForm({SeaCatchImages}: {SeaCatchImages: SeaCatchImage[]}) {
  const fetcher = useFetcher();
  return (
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
              <input type="radio" id="sold-out" name="state" value="sold-out" />
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
              {SeaCatchImages.map((img) => (
                <option key={img.id} value={img.image}>
                  {img.image}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-700"
          type="submit"
        >
          Add SeaCatch
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
