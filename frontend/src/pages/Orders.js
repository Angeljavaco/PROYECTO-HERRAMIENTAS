import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = data.filter((order) => order.user === user);
    setOrders(userOrders);
  }, [user]);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <header className="page-header">
          <p className="eyebrow">Pedidos</p>
          <h1>Mis pedidos</h1>
          <p>Consulta tus compras guardadas y revisa el detalle de cada pedido.</p>
        </header>

        {!user && (
          <div className="empty-state">
            <p>Debes iniciar sesion para ver tus pedidos.</p>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Ir a login
            </button>
          </div>
        )}

        {user && orders.length === 0 && (
          <div className="empty-state">
            <p>No tienes pedidos aun.</p>
            <button className="btn btn-brand" onClick={() => navigate("/")}>
              Ir a comprar
            </button>
          </div>
        )}

        {user && orders.length > 0 && (
          <section className="orders-grid">
            {orders.map((order) => (
              <button
                key={order.id}
                className="order-card"
                onClick={() => navigate("/order-detail", { state: order })}
              >
                <p className="summary-label">Pedido #{order.id}</p>
                <h3>{order.date}</h3>
                <p className="muted">{order.items.length} producto(s)</p>
                <p className="order-total">S/. {Number(order.total).toFixed(2)}</p>
                <span className="btn btn-ghost">Ver detalle</span>
              </button>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Orders;
