import {Link, useFetcher, useLoaderData} from "@remix-run/react";
import {AnimatePresence, motion} from "framer-motion";
import {type ActionFunctionArgs} from "@remix-run/node";
import {
  CartItem,
  OrderItem,
  Orders,
  OrdersSchema,
} from "~/db/records/orders.server";
import {db} from "~/db/db.server";
import {eq} from "drizzle-orm";
import {SeaCatches} from "~/db/records/sea-catches.server";
import {cn} from "~/lib/cn";

export async function action({request}: ActionFunctionArgs) {
  let formData = await request.formData();
  let action = formData.get("_action");
  if (action === "delete-order-item") {
    let catchId = formData.get("catch-id");

    if (catchId === null) {
      return new Response("Invalid form data", {status: 400});
    }
    await db.delete(Orders).where(eq(Orders.catch_id, Number(catchId)));
    return new Response("OK", {status: 200});
  }

  return null;
}

async function getOrderItems() {
  return await db
    .select({
      id: Orders.id,
      catch_id: Orders.catch_id,
      name: SeaCatches.name,
      price: SeaCatches.price,
      species: SeaCatches.species,
      description: SeaCatches.description,
    })
    .from(Orders)
    .innerJoin(SeaCatches, eq(Orders.catch_id, SeaCatches.id));
}

export async function loader() {
  let ordersList = OrdersSchema.parse(await getOrderItems());
  let groupedOrders = groupOrderItemsV2(ordersList);
  let total = ordersList.reduce((total, order) => {
    return total + order.price;
  }, 0);
  return {
    orders: groupedOrders,
    total,
  };
}

export default function Cart() {
  let {orders, total} = useLoaderData<typeof loader>();
  let fetcher = useFetcher();
  return (
    <div className="bg-white px-2">
      <ul className="mb-2 flex flex-col gap-2 ">
        <AnimatePresence>
          {orders.map((cartItem) => (
            <motion.li
              key={cartItem.id}
              className="flex items-center justify-between overflow-hidden border-b border-gray-700 pb-1 text-sm text-gray-900"
              initial={{opacity: 0, height: 0, x: -100}}
              animate={{opacity: 1, height: "auto", x: 0}}
              exit={{
                opacity: 0,
                x: -10,
                transition: {
                  duration: 0.1,
                },
              }}
              transition={{
                duration: 0.2,
                type: "spring",
              }}
              layout
            >
              <div className="flex gap-1">
                <span className="peer flex gap-1">
                  <motion.span
                    className="text-gray-600"
                    initial={{scale: 0.6}}
                    animate={{scale: 1}}
                    exit={{scale: 0.6}}
                    transition={{type: "spring", duration: 0.2}}
                    layout
                  >
                    {cartItem.quantity} lbs
                  </motion.span>
                  <span>{cartItem.name}</span>
                </span>
                <fetcher.Form
                  method="post"
                  className="opacity-45 hover:opacity-80 peer-hover:opacity-80"
                >
                  <button
                    type="submit"
                    name="_action"
                    value="delete-order-item"
                    className="hover:opacity-85"
                  >
                    Ⅹ
                  </button>
                  <input
                    type="hidden"
                    name="catch-id"
                    value={cartItem.catch_id}
                  />
                </fetcher.Form>
              </div>
              <motion.span
                className="text-gray-600"
                initial={{scale: 0.6}}
                animate={{scale: 1}}
                exit={{scale: 0.6}}
                transition={{type: "spring", duration: 0.2}}
                layout
              >
                {(cartItem.price * cartItem.quantity).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </motion.span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="space-y-1">
        <Checkout disabled={orders.length === 0} />
        <Total total={total} />
      </div>
    </div>
  );
}

function Checkout({disabled}: {disabled: boolean}) {
  return (
    <div className="flex justify-end">
      <Link
        className={cn(
          "border-2 border-gray-600 bg-gray-700 px-2 py-1 text-gray-100 transition-colors hover:bg-gray-50 hover:text-gray-900",
          disabled && "pointer-events-none opacity-50",
        )}
        to="/checkout"
      >
        Checkout
      </Link>
    </div>
  );
}

function Total({total}: {total: number}) {
  return (
    <div
      className="relative flex  justify-between border-y border-gray-900 px-2
          py-3 text-sm before:absolute before:inset-0  before:z-[-1] before:border-t-2 before:border-gray-900
          before:content-[''] after:absolute after:inset-0 after:bottom-[0]  after:z-[-1]  after:w-full after:border-b-2 after:border-gray-900 after:content-['']"
    >
      <span className="font-bold">Total:</span>{" "}
      <motion.span
        className="font-bold"
        initial={{scale: 0.6}}
        animate={{scale: 1}}
        exit={{scale: 0.6}}
        transition={{type: "spring", duration: 0.2}}
        layout
      >
        {total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </motion.span>
    </div>
  );
}

function groupOrderItemsV2(orderItems: OrderItem[]) {
  let result: CartItem[] = [];
  for (let item of orderItems) {
    let foundItem = result.find((i) => i.catch_id === item.catch_id);
    if (foundItem) {
      foundItem.quantity++;
    } else {
      result.push({...item, quantity: 1});
    }
  }
  return result;
}
