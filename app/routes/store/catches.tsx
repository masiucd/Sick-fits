import {useFetcher} from "@remix-run/react";
import {type SeaCatch} from "~/db/records/sea-catches.server";
import {cn} from "~/lib/cn";

export function SeaCatchesSection({seaCatches}: {seaCatches: SeaCatch[]}) {
  return (
    <>
      <div className="mt-10 border-b-2 border-gray-800 pb-10 text-center">
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
        <p className="relative text-center text-base font-semibold uppercase tracking-tighter text-primary-500 before:absolute before:left-[10%] before:top-1/2 before:h-[2px]   before:w-7 before:bg-gray-800 before:content-[''] after:absolute after:right-[10%] after:top-1/2 after:h-[2px]   after:w-7 after:bg-gray-800 after:content-['']">
          We have the freshest fish in the world
        </p>
      </div>
      <ul className="flex  flex-col gap-5 px-2 py-5">
        {seaCatches.map((seaCatch) => (
          <SeaCatchCard key={seaCatch.id} seaCatch={seaCatch} />
        ))}
      </ul>
    </>
  );
}

function SoldOut({isDisabled}: {isDisabled: boolean}) {
  if (!isDisabled) return null;
  return (
    <div className=" absolute left-16 z-20 rotate-12 border-2 border-red-500 bg-white px-2 py-1 text-center font-bold uppercase  tracking-tight md:w-44  md:text-xl">
      <p>Sold out!</p>
    </div>
  );
}

function SeaCatchCard({seaCatch}: {seaCatch: SeaCatch}) {
  let fetcher = useFetcher();
  let isDisabled = seaCatch.state === "sold-out";
  return (
    <li
      className={cn(
        "relative flex h-32  gap-2 border-b-2 border-gray-900/60 px-2  py-5 shadow-sm after:absolute after:-bottom-2 after:left-0 after:h-[1px] after:w-full after:bg-slate-900 after:content-['']",
        isDisabled && "opacity-80",
      )}
    >
      <SoldOut isDisabled={isDisabled} />
      <div className="flex-1">
        <img
          src={`/images/${seaCatch.image}.jpg`}
          alt={seaCatch.name}
          className="aspect-auto h-full w-32 object-contain"
        />
      </div>
      <div className="flex flex-[2] flex-col gap-1 ">
        <div className="flex justify-between">
          <p className="text-2xl font-bold uppercase tracking-tight md:text-xl">
            {seaCatch.name}
          </p>
          <p className="text-2xl font-bold uppercase tracking-tight md:text-xl">
            {seaCatch.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <p className="truncate text-sm">{seaCatch.description}</p>
        <fetcher.Form method="post" className="mt-auto ">
          <input type="hidden" name="sea-catch-id" value={seaCatch.id} />
          <button
            type="submit"
            className="group relative w-32 border border-gray-900 px-2 py-1 text-sm font-semibold shadow transition-colors duration-200 after:absolute after:left-0 after:top-0 after:h-0 after:w-full after:bg-gray-900 after:text-gray-50 after:transition-all after:duration-300 after:content-[''] after:hover:h-full disabled:pointer-events-none   disabled:shadow-none  disabled:hover:bg-gray-50 disabled:hover:text-gray-900"
            name="_action"
            value="add-to-cart"
            disabled={isDisabled}
          >
            <span className="relative z-10 group-hover:text-white">
              Add to cart
            </span>
          </button>
        </fetcher.Form>
      </div>
    </li>
  );
}
