import {Link} from "@remix-run/react";
import {AppTitle} from "~/components/app-title";

export default function Home() {
  return (
    <section className="flex flex-1 items-center border border-red-500">
      <div className="mx-auto flex w-full max-w-xl flex-col justify-center rounded-e-md bg-white p-5 shadow-md ">
        <AppTitle classNameOf="left-[-10%]" classNameThe="right-[-60%]" />
        <Link
          to="/store"
          className="mt-5 text-pretty rounded-md bg-gray-900 p-2 text-center text-2xl font-semibold uppercase tracking-tight text-primary-400 hover:opacity-55"
        >
          Store
        </Link>
      </div>
    </section>
  );
}
