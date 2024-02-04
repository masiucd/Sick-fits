import {Link, useLocation} from "@remix-run/react";
import {type PropsWithChildren} from "react";

export default function Orders({children}: PropsWithChildren) {
  let {pathname} = useLocation();
  return (
    <div className="col-span-3 border-2 border-gray-900 bg-white">
      <h2 className="mb-5 px-2 py-3 text-center text-2xl tracking-tighter md:text-4xl">
        {pathname === "/store/cart" && "Your order"}
      </h2>
      {pathname !== "/store/cart" && (
        <div className="px-2 py-1">
          <Link
            to="/store/cart"
            className="mb-5 block text-center text-2xl tracking-tighter transition-all animate-duration-150 hover:text-primary-500 hover:opacity-85 md:text-4xl"
          >
            View your orders &rarr;
          </Link>
          <p>
            <span className="bg-gray-800 p-1 text-primary-500 drop-shadow-2xl">
              Cath of the day
            </span>{" "}
            is a Remix application that allows you to order fresh fish from the
            sea. We have the freshest fish in the world.
          </p>
          <section className="my-5">
            <p className="mb-2 bg-gray-800 p-1 text-xl font-semibold uppercase tracking-tighter text-primary-500">
              Tools used to build this application include:
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm md:text-lg">
              {links.map((link) => (
                <li key={link.href}>
                  <A href={link.href}>{link.text}</A>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      {children}
    </div>
  );
}

let links = [
  {
    href: "https://remix.run",
    text: "Remix",
  },
  {
    href: "https://reactjs.org",
    text: "React",
  },
  {
    href: "https://tailwindcss.com",
    text: "Tailwind CSS",
  },
  {
    href: "https://orm.drizzle.team/",
    text: "Drizzle",
  },
  {
    href: "https://www.sqlite.org/index.html",
    text: "SQL lite",
  },
];

function A({href, children}: PropsWithChildren<{href: string}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-gray-700 underline hover:text-primary-500"
    >
      {children}
    </a>
  );
}
