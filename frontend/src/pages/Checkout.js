import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("yape");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    card: "",
    cvv: ""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleBuy = () => {
    if (!form.name || !form.address) {
      alert("Completa los datos de envio");
      return;
    }

    const user = localStorage.getItem("user");

    if (user) {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        id: Date.now(),
        user,
        items: cart,
        total,
        date: new Date().toLocaleString()
      };

      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    localStorage.removeItem("cart");
    setCart([]);
    setShowModal(true);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <header className="page-header">
          <p className="eyebrow">Checkout</p>
          <h1>Finaliza tu compra</h1>
          <p>Confirma tus productos, completa el envio y elige el metodo de pago que prefieras.</p>
        </header>

        <section className="checkout-layout">
          <div>
            <section className="section-panel">
              <h2>Datos de envio</h2>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  id="name"
                  className="form-input"
                  name="name"
                  placeholder="Nombre del comprador"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Direccion</label>
                <input
                  id="address"
                  className="form-input"
                  name="address"
                  placeholder="Direccion de entrega"
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="section-panel">
              <h2>Metodo de pago</h2>
              <select
                className="select-input"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="yape">Yape</option>
                <option value="paypal">PayPal</option>
                <option value="card">Tarjeta</option>
              </select>

              {payment === "yape" && (
                <div className="payment-box">
                  <strong>Pago con Yape</strong>
                  <p className="muted">Escanea el QR y confirma la compra cuando el pago este listo.</p>
                  <img
                    className="qr-img"
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PagoYape"
                    alt="QR Yape"
                  />
                </div>
              )}

              {payment === "paypal" && (
                <div className="payment-box">
                  <strong>PayPal</strong>
                  <p className="muted">Simularemos la redireccion para completar el pago.</p>
                </div>
              )}

              {payment === "card" && (
                <div className="payment-box">
                  <div className="form-group">
                    <label htmlFor="card">Numero de tarjeta</label>
                    <input
                      id="card"
                      className="form-input"
                      name="card"
                      placeholder="0000 0000 0000 0000"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      className="form-input"
                      name="cvv"
                      placeholder="123"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="summary-panel">
            <div>
              <h2>Resumen</h2>
              {cart.length === 0 ? (
                <div className="empty-state">Carrito vacio.</div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="order-line" key={item.id}>
                      <div>
                        <p className="item-title">{item.name}</p>
                        <span className="item-meta">Cantidad: {item.quantity || 1}</span>
                      </div>
                      <strong>S/. {item.price * (item.quantity || 1)}</strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="total-row">
                <span className="summary-label">Total</span>
                <strong className="summary-value">S/. {total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="btn btn-brand" onClick={handleBuy} disabled={cart.length === 0}>
              Confirmar compra
            </button>
          </aside>
        </section>

        {showModal && (
          <div className="overlay">
            <div className="modal">
              <h2>Compra exitosa</h2>
              <p className="muted">Gracias por tu pedido. Ya puedes seguir explorando productos.</p>
              <button
                className="btn btn-brand"
                onClick={() => {
                  setShowModal(false);
                  navigate("/");
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
