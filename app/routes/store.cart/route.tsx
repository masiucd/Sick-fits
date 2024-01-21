import {useLoaderData} from "@remix-run/react";
import {type OrderItem, OrdersSchema} from "~/db/sea-catches";
import {getOrderItems} from "./db.server";

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
      <ul>
        {Object.keys(orders).map((key) => {
          const {item, qty} = orders[key];
          return (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.species}</p>
              <p>{item.description}</p>
              <p>{item.price}</p>
              <p>{qty}</p>
            </li>
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
