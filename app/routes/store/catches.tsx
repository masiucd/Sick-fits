import {useFetcher} from "@remix-run/react";
import {format, parseISO} from "date-fns";
import {type SeaCatch} from "~/db/records/sea-catches.server";

export function SeaCatchesSection({seaCatches}: {seaCatches: SeaCatch[]}) {
  return (
    <div className="col-span-5 max-h-[95dvh] overflow-y-scroll border-2 border-gray-900 bg-white">
      <div className="my-10 text-center">
        <h1 className="mb-5 text-pretty text-6xl font-semibold capitalize leading-[2cm] tracking-tight">
          Catch
          <span className="relative mx-2  bg-anchor bg-cover bg-center bg-no-repeat px-10 py-5">
            <span className="absolute left-[-25%] top-[35%] h-full w-full bg-cover bg-center text-xl tracking-normal text-primary-500">
              of
            </span>
            <span className="absolute right-[-30%] top-[35%] h-full w-full bg-cover bg-center text-xl tracking-normal text-primary-500">
              the
            </span>
          </span>
          day
        </h1>
        <p className="relative text-center text-base font-semibold uppercase tracking-tighter text-primary-500 before:absolute before:left-[12%] before:top-1/2 before:h-[2px]   before:w-7 before:bg-gray-800 before:content-[''] after:absolute after:right-[12%] after:top-1/2 after:h-[2px]   after:w-7 after:bg-gray-800 after:content-['']">
          We have the freshest fish in the world
        </p>
      </div>
      <ul className="flex  flex-col gap-5 px-2 py-5">
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
    <li className="relative flex  gap-2 border-y-2 border-gray-900/60 px-2  py-5 shadow-sm after:absolute after:bottom-1 after:left-1/4 after:h-[1px] after:w-[50%] after:bg-slate-900 after:content-['']">
      <div className="flex-1 ">
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
