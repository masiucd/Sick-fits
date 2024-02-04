import {cn} from "~/lib/cn";

export function AppTitle({
  classNameOf,
  classNameThe,
}: {
  classNameOf?: string;
  classNameThe?: string;
}) {
  return (
    <h1 className="mb-5 text-pretty text-6xl font-semibold capitalize leading-[2cm] tracking-tight">
      Catch
      <span className="relative mx-2  bg-anchor bg-cover bg-center bg-no-repeat px-10 py-5">
        <span
          className={cn(
            "absolute left-[-25%] top-[35%] h-full w-full bg-cover bg-center text-xl tracking-normal text-primary-500",
            classNameOf,
          )}
        >
          of
        </span>
        <span
          className={cn(
            "absolute right-[-30%] top-[35%] h-full w-full bg-cover bg-center text-xl tracking-normal text-primary-500",
            classNameThe,
          )}
        >
          the
        </span>
      </span>
      day
    </h1>
  );
}
