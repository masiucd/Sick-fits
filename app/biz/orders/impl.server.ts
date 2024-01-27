import {
  deleteOrder as deleteOrderDao,
  getOrderItems as getOrderItemsDao,
} from "~/db/orders/dao.server";

export async function deleteOrder(id: number) {
  deleteOrderDao(id);
}

export async function getOrderItems() {
  return await getOrderItemsDao();
}
