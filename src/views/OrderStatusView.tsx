import React from "react";
import { Order } from "../model/Order";

export function OrderStatusView(params: {order: Order}) {
  let order = params.order

  return <div>
    {order._id['id']}
    {order.status}
    {order.isPaid ? 'check' : 'no check'}
  </div>

}

export default OrderStatusView;
