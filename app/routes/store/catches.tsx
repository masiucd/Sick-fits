import {useFetcher} from "@remix-run/react";
import {format, parseISO} from "date-fns";
import {type SeaCatch} from "~/db/records/sea-catches.server";

export function SeaCatchesSection({seaCatches}: {seaCatches: SeaCatch[]}) {
  return (
    <div className="col-span-4 border-2 border-gray-900">
      <h1 className="mb-5">Welcome to SeaCatch of today</h1>
      <ul className="flex max-h-[90dvh] flex-col gap-5 overflow-y-scroll px-2">
        {seaCatches.map((seaCatch) => (
          <SeaCatchCard key={seaCatch.id} seaCatch={seaCatch} />
        ))}
      </ul>
    </div>
  );
}

function SeaCatchCard({seaCatch}: {seaCatch: SeaCatch}) {
  const fetcher = useFetcher();

  return (
    <li className="flex gap-2 bg-gray-100 shadow-sm ">
      <div className="flex-1 border border-red-400">
        <img
          src={`/images/${seaCatch.image || seaCatch.name}.jpg`}
          alt={seaCatch.name}
          className="aspect-auto h-full w-full object-contain"
          // className="aspect-auto h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-[2] flex-col gap-1">
        <p className="">
          <span className="text-xl font-bold">{seaCatch.name}</span>
        </p>
        <p>
          {seaCatch.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <p>{seaCatch.species}</p>
        <p>{seaCatch.description}</p>
        <p>{format(parseISO(seaCatch.created_at), "MMMM do, yyyy")}</p>
        <fetcher.Form method="post">
          <input type="hidden" name="sea-catch-id" value={seaCatch.id} />
          <button
            type="submit"
            className="w-full border border-gray-900 px-2 py-1 font-semibold transition-colors duration-200 hover:bg-gray-900 hover:text-gray-50"
            name="_action"
            value="add-to-cart"
          >
            Add to cart
          </button>
        </fetcher.Form>
      </div>
    </li>
  );
}
