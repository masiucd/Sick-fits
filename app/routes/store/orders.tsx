import {Link, useLocation} from "@remix-run/react";
import {PropsWithChildren} from "react";

export default function Orders({children}: PropsWithChildren) {
  let {pathname} = useLocation();
  return (
    <div className="col-span-3 border-2 border-gray-900 bg-white">
      <h2 className="mb-5">
        {pathname === "/store/cart" ? (
          "Your orders"
        ) : (
          <Link to="/store/cart">View your orders</Link>
        )}
      </h2>
      {children}
    </div>
  );
}
