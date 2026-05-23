import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const increase = (id) => {
    saveCart(cart.map((item) => (
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )));
  };

  const decrease = (id) => {
    saveCart(cart.map((item) => (
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )));
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <header className="page-header">
          <p className="eyebrow">Carrito</p>
          <h1>Carrito de compras</h1>
          <p>Actualiza cantidades, elimina productos y continua al checkout.</p>
        </header>

        <section className="section-panel">
          {cart.length === 0 ? (
            <div className="empty-state">Carrito vacio</div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img className="order-thumb" src={item.image} alt={item.name} />

                  <div>
                    <p className="item-title">{item.name}</p>
                    <span className="item-meta">S/. {item.price}</span>
                  </div>

                  <div className="quantity-control">
                    <button className="btn btn-icon" onClick={() => decrease(item.id)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button className="btn btn-icon" onClick={() => increase(item.id)}>+</button>
                  </div>

                  <button className="btn btn-danger" onClick={() => removeItem(item.id)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="total-row cart-total-row">
            <span className="summary-label">Total</span>
            <strong className="summary-value">S/. {total.toFixed(2)}</strong>
          </div>

          <button
            className="btn btn-brand"
            onClick={() => navigate("/checkout")}
            disabled={cart.length === 0}
          >
            Ir a pagar
          </button>
        </section>
      </main>
    </div>
  );
}

export default Cart;
