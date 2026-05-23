import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../utils/api";

const phoneRegex = /^\+[1-9]\d{7,14}$/;

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("yape");
  const [showModal, setShowModal] = useState(false);
  const [smsStatus, setSmsStatus] = useState(null);
  const [sendingSms, setSendingSms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    card: "",
    cvv: ""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
    setCart(data);
    setForm((current) => ({
      ...current,
      name: profile.name || "",
      phone: profile.phone || ""
    }));
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

  const sendSmsReminder = async (order, phone) => {
    setSendingSms(true);
    setSmsStatus(null);

    try {
      const response = await fetch(apiUrl("/SmsReminderController"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.user,
          phone,
          total: order.total,
          message: `Hola ${order.user}, tu pedido #${order.id} fue registrado por S/. ${Number(order.total).toFixed(2)}. Te avisaremos cuando este en camino.`
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo enviar el SMS");
      }

      setSmsStatus({
        type: "success",
        text: result.message || `SMS enviado correctamente a ${result.phone}`
      });
    } catch (error) {
      setSmsStatus({
        type: "error",
        text: `Compra guardada, pero fallo el SMS: ${error.message}`
      });
    } finally {
      setSendingSms(false);
    }
  };

  const handleBuy = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Inicia sesion para confirmar la compra y recibir el SMS.");
      navigate("/login");
      return;
    }

    if (!form.name || !form.address) {
      alert("Completa los datos de envio");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Ingresa el telefono en formato internacional. Ejemplo: +51987654321");
      return;
    }

    let newOrder = null;

    if (user) {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      newOrder = {
        id: Date.now(),
        user,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: cart,
        total,
        date: new Date().toLocaleString(),
        smsStatus: "PENDING"
      };

      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      await sendSmsReminder(newOrder, form.phone);
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
                  value={form.name}
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
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefono registrado para SMS</label>
                <input
                  id="phone"
                  className="form-input"
                  name="phone"
                  placeholder="+51987654321"
                  value={form.phone}
                  onChange={handleChange}
                />
                <small className="field-help">
                  Usa formato internacional E.164 para Twilio, por ejemplo +51 seguido del numero.
                </small>
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
              {sendingSms ? "Enviando SMS..." : "Confirmar compra"}
            </button>
          </aside>
        </section>

        {showModal && (
          <div className="overlay">
            <div className="modal">
              <h2>Compra exitosa</h2>
              <p className="muted">Gracias por tu pedido. Ya puedes seguir explorando productos.</p>
              {smsStatus && (
                <p className={`sms-feedback ${smsStatus.type}`}>
                  {smsStatus.text}
                </p>
              )}
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
