import type {LinksFunction} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";

export let links: LinksFunction = () => [
  {rel: "stylesheet", href: styles},
  {rel: "stylesheet", href: "/fonts/haymaker.css"},
  {rel: "stylesheet", href: "/fonts/blanch_caps_inline.css"},
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-200 font-sans text-gray-900">
        <main className="flex min-h-dvh  flex-col">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
