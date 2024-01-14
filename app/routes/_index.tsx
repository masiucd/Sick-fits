import type {MetaFunction} from "@remix-run/node";
import {db, fishes} from "~/db/db";

export const meta: MetaFunction = () => {
  return [
    {title: "New Remix App"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export async function loader() {
  const res = await db.select().from(fishes).all();
  console.log("res", res);
  return null;
}

export default function Index() {
  return (
    <div>
      <h1>Welcome to catch of today</h1>
    </div>
  );
}
