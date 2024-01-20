import {Link} from "@remix-run/react";

export default function Home() {
  return (
    <div>
      Home
      <Link to="/store">Store</Link>
    </div>
  );
}
