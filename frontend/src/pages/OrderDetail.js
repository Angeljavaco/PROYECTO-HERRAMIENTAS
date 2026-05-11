import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state;

  if (!order) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="container page-header">
          <h1>No hay informacion del pedido</h1>
          <button className="btn btn-brand" onClick={() => navigate("/orders")}>
            Volver a pedidos
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <header className="page-header">
          <div className="back-row">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
          <p className="eyebrow">Pedido #{order.id}</p>
          <h1>Detalle del pedido</h1>
          <p>Compra realizada el {order.date}.</p>
        </header>

        <section className="section-panel">
          <div className="cart-header">
            <div>
              <h2>Productos</h2>
              <p className="muted">{order.items.length} producto(s) en este pedido.</p>
            </div>
            <strong className="price">S/. {Number(order.total).toFixed(2)}</strong>
          </div>

          <div className="cart-items">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <img className="order-thumb" src={item.image} alt={item.name} />
                <div>
                  <p className="item-title">{item.name}</p>
                  <span className="item-meta">Cantidad: {item.quantity}</span>
                </div>
                <strong>S/. {item.price}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderDetail;
