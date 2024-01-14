import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {title: "New Remix App"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to catch of today</h1>
    </div>
  );
}
