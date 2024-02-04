import {type ActionFunctionArgs, type MetaFunction} from "@remix-run/node";
import {Outlet, useLoaderData} from "@remix-run/react";
import OrdersComponent from "./orders";
import {
  SeaCatchImageSchema,
  SeaCatchSchema,
} from "~/db/records/sea-catches.server";
import {SeaCatchesSection} from "./catches";
import {Inventory} from "./inventory";
import {handleAction, getImages, getSeaCatches} from "./handlers.server";

export let meta: MetaFunction = () => {
  return [
    {title: "SeaCatch of today"},
    {name: "description", content: "SeaCatch of today is a fish market app 🐟"},
  ];
};

export async function action({request}: ActionFunctionArgs) {
  let formData = await request.formData();
  let action = formData.get("_action");
  return await handleAction(action, formData);
}

export async function loader() {
  return {
    seaCatchImages: SeaCatchImageSchema.array().parse(await getImages()),
    seaCatches: SeaCatchSchema.array().parse(await getSeaCatches()),
  };
}

export default function Stores() {
  let {seaCatches, seaCatchImages} = useLoaderData<typeof loader>();
  return (
    <section className="my-10 flex flex-1 flex-col ">
      <div className="grid flex-1 grid-cols-1 md:grid-cols-12">
        <div className="col-span-5 max-h-[95dvh] overflow-y-scroll border-2 border-gray-900 bg-white">
          <SeaCatchesSection seaCatches={seaCatches} />
        </div>
        <div className="col-span-3 border-2 border-gray-900 bg-white px-2">
          <OrdersComponent>
            <Outlet />
          </OrdersComponent>
        </div>
        <div className="col-span-4 max-h-[95dvh] overflow-y-scroll border-2 border-gray-900 bg-white px-4  ">
          <Inventory seaCatches={seaCatches} seaCatchImages={seaCatchImages} />
        </div>
      </div>
    </section>
  );
}
