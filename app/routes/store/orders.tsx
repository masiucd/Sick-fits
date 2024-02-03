import {Link, useLocation} from "@remix-run/react";
import {PropsWithChildren} from "react";

export default function Orders({children}: PropsWithChildren) {
  let {pathname} = useLocation();
  return (
    <div className="col-span-3 border-2 border-gray-900 bg-white">
      <h2 className="mb-5 px-2 py-3 text-center text-2xl tracking-tighter md:text-4xl">
        {pathname === "/store/cart" && "Your order"}
      </h2>
      {pathname !== "/store/cart" && (
        <Link to="/store/cart">View your orders</Link>
      )}

      {children}
    </div>
  );
}
