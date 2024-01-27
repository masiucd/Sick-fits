import {useLoaderData} from "@remix-run/react";
import {type OrderItem, OrdersSchema} from "~/db/sea-catches";
import {getOrderItems} from "./db.server";
import {motion} from "framer-motion";

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

  return (
    <div>
      <ul className="mb-2 flex flex-col gap-2 px-2">
        {Object.keys(orders).map((key) => {
          const {item, qty} = orders[key];
          return (
            <motion.li
              key={item.id}
              className="flex min-h-10 items-center justify-between  border-b border-gray-700 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              initial={{opacity: 0.3, x: -100}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5, type: "spring"}}
            >
              <div className="flex gap-2">
                <motion.span
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{duration: 0.5}}
                  className="flex items-center gap-1"
                >
                  <button>
                    <span>&larr;</span>
                  </button>
                  <span>{qty}</span>
                  <button>
                    <span>&rarr;</span>
                  </button>
                </motion.span>
                <p className="text-balance font-semibold  capitalize">
                  {item.name}
                </p>
              </div>
              <p>
                {(item.price * qty).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </motion.li>
          );
        })}
      </ul>
      <div
        className="relative flex  justify-between px-2
                py-3 before:absolute before:inset-0 before:z-[-1]  before:border-t-2 before:border-gray-900 before:content-['']
                after:absolute after:inset-0 after:bottom-[0] after:z-[-1]  after:w-full  after:border-b-2 after:border-gray-900 after:content-['']"
      >
        <span className="font-bold">Total:</span>{" "}
        <span>
          {total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>
    </div>
  );
}

function groupOrderItems(orderItems: OrderItem[]) {
  const groupedOrders = orderItems.reduce(
    (
      obj: {
        [key: string]: {qty: number; item: OrderItem};
      },
      item: OrderItem,
    ) => {
      if (obj[item.name]) {
        obj[item.name].qty += 1;
      } else {
        obj[item.name] = {qty: 1, item};
      }
      return obj;
    },
    {},
  );

  return groupedOrders;
}
