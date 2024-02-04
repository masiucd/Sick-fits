import {SeaCatch, type SeaCatchImage} from "~/db/records/sea-catches.server";
import {InventoryForm} from "./inventory-form";

type Props = {
  seaCatches: SeaCatch[];
  seaCatchImages: SeaCatchImage[];
};

export function Inventory({seaCatchImages, seaCatches}: Props) {
  return (
    <>
      <h3 className="mb-5 px-2 py-3 text-center text-2xl tracking-tighter md:text-4xl">
        Inventory
      </h3>
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
    </>
  );
}
