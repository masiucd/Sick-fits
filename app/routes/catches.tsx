import {useFetcher} from "@remix-run/react";
import {format, parseISO} from "date-fns";
import {type SeaCatch} from "~/db/sea-catches";

export function SeaCatchesSection({SeaCatches}: {SeaCatches: SeaCatch[]}) {
  return (
    <div className="col-span-4 border-2 border-gray-900  ">
      <h1 className="mb-5">Welcome to SeaCatch of today</h1>
      <ul className="flex max-h-[90dvh] flex-col gap-5 overflow-y-scroll">
        {SeaCatches.map((seaCatch) => (
          <FishCard key={seaCatch.id} seaCatch={seaCatch} />
        ))}
      </ul>
    </div>
  );
}

function FishCard({seaCatch}: {seaCatch: SeaCatch}) {
  const fetcher = useFetcher();
  return (
    <li>
      <h2>{seaCatch.name}</h2>
      <h2>
        {seaCatch.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </h2>
      <p>{seaCatch.species}</p>
      <p>{seaCatch.description}</p>
      <p>{format(parseISO(seaCatch.created_at), "MMMM do, yyyy")}</p>
      <img
        src={`/images/${seaCatch.image || seaCatch.name}.jpg`}
        alt={seaCatch.name}
      />
      <fetcher.Form method="post">
        <input type="hidden" name="sea-catch-id" value={seaCatch.id} />
        <button
          type="submit"
          className="rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-700"
          name="_action"
          value="add-to-cart"
        >
          Add to cart
        </button>
      </fetcher.Form>
    </li>
  );
}
