import {useFetcher} from "@remix-run/react";
import {useEffect, useRef} from "react";
import {SeaCatch, type SeaCatchImage} from "~/db/records/sea-catches.server";

type Props = {
  seaCatches: SeaCatch[];
  seaCatchImages: SeaCatchImage[];
};

export function Inventory({seaCatchImages, seaCatches}: Props) {
  return (
    <div className="col-span-4 max-h-[95dvh] overflow-y-scroll border-2 border-gray-900 bg-white px-2 ">
      <h3>Inventory</h3>
      <ul className="flex flex-col gap-5">
        {seaCatches.map((seaCatch) => (
          <InventoryForm
            key={seaCatch.id}
            seaCatch={seaCatch}
            seaCatchImages={seaCatchImages}
          />
        ))}
      </ul>
      <InventoryForm seaCatchImages={seaCatchImages} />
    </div>
  );
}
type InventoryFormProps = {
  seaCatchImages: SeaCatchImage[];
  seaCatch?: SeaCatch;
};
function InventoryForm({seaCatchImages, seaCatch}: InventoryFormProps) {
  let fetcher = useFetcher({key: "inventory"});
  let ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (ref.current && fetcher.data && fetcher.state === "idle") {
      ref.current.reset();
      (ref.current.elements.namedItem("name") as HTMLElement)?.focus();
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <fetcher.Form method="post" ref={ref}>
      <fieldset className="flex flex-col gap-2 border border-gray-800 p-2 text-sm">
        <div className="flex flex-col border-2 md:flex-row">
          <div className="flex flex-1 flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={seaCatch?.name}
              required
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label htmlFor="species">Species</label>
            <select
              name="species"
              id="species"
              required
              defaultValue={seaCatch?.species}
            >
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
                defaultChecked={
                  seaCatch?.state === "fresh" || seaCatch?.state === undefined
                }
              />
            </div>

            <div>
              <label htmlFor="sold-out">Sold out</label>
              <input
                type="radio"
                id="sold-out"
                name="state"
                value="sold-out"
                defaultChecked={seaCatch?.state === "sold-out"}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={seaCatch?.price}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              required
              defaultValue={seaCatch?.description}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="image">Image</label>

            <select name="image" id="image" value={seaCatch?.image}>
              {seaCatchImages.map((img) => (
                <option key={img.id} value={img.image}>
                  {img.image}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input type="hidden" name="sea-catch-id" value={seaCatch?.id} />
        {seaCatch && (
          <button
            className="rounded-sm border border-gray-800 px-1 py-2 font-bold hover:bg-gray-900 hover:text-gray-50"
            type="submit"
            name="_action"
            value="update-sea-catch"
          >
            Update Catch
          </button>
        )}
        <button
          className="rounded-sm border border-gray-800 px-1 py-2 font-bold hover:bg-gray-900 hover:text-gray-50"
          type="submit"
          name="_action"
          value={seaCatch ? "remove-sea-catch" : "add-sea-catch"}
        >
          {seaCatch ? "Remove Catch" : "Add Catch"}
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
