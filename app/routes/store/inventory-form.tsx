import {useFetcher} from "@remix-run/react";
import {useEffect, useRef} from "react";
import {SeaCatch, type SeaCatchImage} from "~/db/records/sea-catches.server";
import {cn} from "~/lib/cn";

type Props = {
  seaCatchImages: SeaCatchImage[];
  seaCatch?: SeaCatch;
};
export function InventoryForm({seaCatchImages, seaCatch}: Props) {
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
      <fieldset className="flex flex-col gap-2 rounded-sm border-2 border-gray-800 p-2 font-serif text-sm">
        <NameAndSpecies seaCatch={seaCatch} />
        <div className="flex flex-col items-end  md:flex-row">
          <Type seaCatch={seaCatch} />
          <Price seaCatch={seaCatch} />
        </div>
        <TextAreaAndImage seaCatchImages={seaCatchImages} seaCatch={seaCatch} />
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

function FormGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  let formattedLabel = label.replaceAll("-", " ");
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={label} className="capitalize">
        {formattedLabel}
      </label>
      {children}
    </div>
  );
}

function Type({seaCatch}: {seaCatch?: SeaCatch}) {
  return (
    <div className="flex flex-1 gap-5 ">
      <FormGroup label="fresh" className="flex-row items-center">
        <input
          type="radio"
          id="fresh"
          name="state"
          value="fresh"
          defaultChecked={
            seaCatch?.state === "fresh" || seaCatch?.state === undefined
          }
        />
      </FormGroup>

      <FormGroup label="sold-out" className="flex-row items-center">
        <input
          type="radio"
          id="sold-out"
          name="state"
          value="sold-out"
          defaultChecked={seaCatch?.state === "sold-out"}
        />
      </FormGroup>
    </div>
  );
}

function Price({seaCatch}: {seaCatch?: SeaCatch}) {
  return (
    <FormGroup className=" flex-1 " label="price">
      <input
        type="number"
        name="price"
        id="price"
        defaultValue={seaCatch?.price}
        className="p-0 pl-1 capitalize"
      />
    </FormGroup>
  );
}

function NameAndSpecies({seaCatch}: {seaCatch?: SeaCatch}) {
  return (
    <div className="flex flex-col md:flex-row">
      <FormGroup label="name" className="flex-1">
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={seaCatch?.name}
          required
          className="p-0 pl-1 capitalize"
        />
      </FormGroup>

      <FormGroup label="species" className="flex-1">
        <select
          name="species"
          id="species"
          required
          defaultValue={seaCatch?.species}
          className="p-0 pl-1 capitalize"
        >
          <option defaultChecked value="shell" className="capitalize ">
            Shell
          </option>
          <option value="fish" className="capitalize">
            Fish
          </option>
          <option value="crab" className="capitalize">
            Crab
          </option>
          <option value="lobster" className="capitalize">
            Lobster
          </option>
        </select>
      </FormGroup>
    </div>
  );
}

function TextAreaAndImage({
  seaCatchImages,
  seaCatch,
}: {
  seaCatchImages: SeaCatchImage[];
  seaCatch?: SeaCatch;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FormGroup label="description">
        <textarea
          id="description"
          name="description"
          required
          defaultValue={seaCatch?.description}
        />
      </FormGroup>

      <FormGroup label="image">
        <select
          name="image"
          id="image"
          value={seaCatch?.image}
          className="p-0 pl-1 capitalize"
        >
          {seaCatchImages.map((img) => (
            <option key={img.id} value={img.image}>
              {img.image}
            </option>
          ))}
        </select>
      </FormGroup>
    </div>
  );
}
