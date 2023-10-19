import React, { useState, useEffect } from "react";
import DittoManager from "./ditto";
import { Document, LiveQuery } from "@dittolive/ditto";
import { Order } from "./model/Order";
import { OrderStatusView } from "./views/OrderStatusView";
import './App.css';

export let ditto: any 
export let liveQuery: LiveQuery

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function startDitto() {
      ditto = DittoManager();
      liveQuery = ditto.observeOpenOrders((docs: Document[]) => {
        let orders = docs.map(doc => new Order(doc));
        console.log(orders);
        setOrders(orders);
      });
    }

    startDitto();
    return () => {
      liveQuery?.stop();
      ditto.close();
    };
  }, []);

  function bump(order: Order) {
    console.log('bump, order', order);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {orders.map((order: Order) => {
            return <div onClick={() => bump(order)}>
              <OrderStatusView order={order} />
            </div>;
          })}
          {error && <p style={{ "color": "red" }}>{error}</p>}
        </div>
      </header>
    </div>
  );
}
