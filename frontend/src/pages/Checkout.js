import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // 🧾 cargar carrito
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // 💰 total
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // 🧠 inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🛒 comprar
  const handleBuy = () => {
    if (!form.name || !form.address) {
      alert("Completa los datos");
      return;
    }

    const user = localStorage.getItem("user");

    // 🔥 guardar pedido SOLO si está logueado
    if (user) {
      let orders = JSON.parse(localStorage.getItem("orders")) || [];

      const newOrder = {
        id: Date.now(),
        user: user,
        items: cart,
        total: total,
        date: new Date().toLocaleString()
      };

      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    // 🧹 limpiar carrito
    localStorage.removeItem("cart");
    setCart([]);

    // 🔥 mostrar modal
    setShowModal(true);
  };

  return (
    <div style={styles.container}>
      <h1>💳 Checkout</h1>

      {/* 🧾 RESUMEN */}
      <div style={styles.section}>
        <h2>🧺 Resumen</h2>

        {cart.length === 0 ? (
          <p>Carrito vacío</p>
        ) : (
          cart.map(item => (
            <p key={item.id}>
              {item.name} x {item.quantity} - S/. {item.price * item.quantity}
            </p>
          ))
        )}

        <h3>Total: S/. {total}</h3>
      </div>

      {/* 👤 DATOS */}
      <div style={styles.section}>
        <h2>📦 Datos de envío</h2>

        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="address"
          placeholder="Dirección"
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* 💳 MÉTODO DE PAGO */}
      <div style={styles.section}>
        <h2>💰 Método de pago</h2>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          style={styles.input}
        >
          <option value="yape">Yape</option>
          <option value="paypal">PayPal</option>
          <option value="card">Tarjeta</option>
        </select>

        {/* YAPE */}
        {payment === "yape" && (
          <div>
            <p>📱 Escanea este QR</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PagoYape"
              alt="QR Yape"
              style={{ marginTop: "10px" }}
            />
          </div>
        )}

        {/* PAYPAL */}
        {payment === "paypal" && (
          <p>🔵 Redirección simulada a PayPal</p>
        )}

        {/* TARJETA */}
        {payment === "card" && (
          <div>
            <input
              name="card"
              placeholder="Número de tarjeta"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="cvv"
              placeholder="CVV"
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        )}
      </div>

      {/* BOTÓN */}
      <button style={styles.button} onClick={handleBuy}>
        Confirmar Compra
      </button>

      {/* 🔥 MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>🎉 ¡Compra exitosa!</h2>
            <p>Gracias por tu pedido</p>

            <button
              style={styles.button}
              onClick={() => {
                setShowModal(false);
                navigate("/"); // 🔥 redirige al home
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "auto"
  },
  section: {
    marginBottom: "20px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "10px"
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px"
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "#ff6a00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "300px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  }
};

export default Checkout;