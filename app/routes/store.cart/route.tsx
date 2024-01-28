import {Link, useFetcher, useLoaderData} from "@remix-run/react";
import {motion} from "framer-motion";
import {type ActionFunctionArgs} from "@remix-run/node";

import {deleteOrder, getOrderItems} from "~/biz/orders/impl.server";
import {OrderItem, OrdersSchema} from "~/db/records/orders.server";
import {addToCart} from "~/biz/sea-catches/impl.server";

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  if (action === "decrease-qty") {
    const cartItemId = formData.get("cart-item-id");
    if (cartItemId === null) {
      return new Response("Invalid form data", {status: 400});
    }
    await deleteOrder(Number(cartItemId));
    return new Response("OK", {status: 200});
  }
  if (action === "increase-qty") {
    const seaCathId = formData.get("sea-catch-id");
    const cartItemId = formData.get("cart-item-id");
    if (cartItemId === null || seaCathId === null) {
      return new Response("Invalid form data", {status: 400});
    }
    // to we want to add a new order item or update an existing one?
    return await addToCart(Number(seaCathId));
  }
  return null;
}

export async function loader() {
  const ordersList = OrdersSchema.parse(await getOrderItems());
  const groupedOrders = groupOrderItems(ordersList);
  const total = ordersList.reduce((total, order) => {
    return total + order.price;
  }, 0);
  return {
    orders: groupedOrders,
    total,
  };
}

export default function Cart() {
  const {orders, total} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="px-2">
      <ul className="mb-2 flex flex-col gap-2 ">
        {Object.keys(orders).map((key) => {
          const {item, qty} = orders[key];
          return (
            <li
              key={item.id}
              className="flex min-h-10 items-center justify-between  border-b border-gray-700 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            >
              <fetcher.Form className="flex gap-2" method="post">
                <input
                  type="hidden"
                  name="sea-catch-id"
                  value={item.catch_id}
                />
                <input type="hidden" name="cart-item-id" value={item.id} />
                <span className="flex items-center gap-1">
                  <button type="submit" name="_action" value="decrease-qty">
                    <span>&larr;</span>
                  </button>
                  <motion.span
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    transition={{duration: 0.5}}
                  >
                    {qty}
                  </motion.span>
                  <button type="submit" name="_action" value="increase-qty">
                    <span>&rarr;</span>
                  </button>
                </span>
                <p className="text-balance font-semibold  capitalize">
                  {item.name}
                </p>
              </fetcher.Form>
              <p>
                {(item.price * qty).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="my-2 flex justify-end">
        <Link
          className="border-2 border-gray-600 bg-gray-700 px-2 py-1 text-gray-100"
          to="/store/checkout"
        >
          Checkout
        </Link>
      </div>

      <div
        className="relative flex  justify-between px-2
                py-3 before:absolute before:inset-0 before:z-[-1]  before:border-t-2 before:border-gray-900 before:content-['']
                after:absolute after:inset-0 after:bottom-[0] after:z-[-1]  after:w-full  after:border-b-2 after:border-gray-900 after:content-['']"
      >
        <span className="font-bold">Total:</span>{" "}
        <motion.span
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{duration: 0.5, type: "spring"}}
        >
          {total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </motion.span>
      </div>
    </div>
  );
}

function groupOrderItems(
  orderItems: OrderItem[],
): Record<string, {qty: number; item: OrderItem}> {
  return orderItems.reduce(
    (acc, item) => {
      acc[item.name] = {
        qty: (acc[item.name]?.qty || 0) + 1,
        item,
      };
      return acc;
    },
    {} as Record<string, {qty: number; item: OrderItem}>,
  );
}
