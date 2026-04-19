import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];

    // 🔥 solo pedidos del usuario logueado
    const userOrders = data.filter(o => o.user === user);

    setOrders(userOrders);
  }, [user]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 Mis pedidos</h1>

      {/* ❌ NO LOGUEADO */}
      {!user && (
        <div style={styles.empty}>
          <p>Debes iniciar sesión para ver tus pedidos</p>
          <button
            style={styles.button}
            onClick={() => navigate("/login")}
          >
            Ir a login
          </button>
        </div>
      )}

      {/* 📭 SIN PEDIDOS */}
      {user && orders.length === 0 && (
        <div style={styles.empty}>
          <p>No tienes pedidos aún</p>
          <button
            style={styles.button}
            onClick={() => navigate("/")}
          >
            Ir a comprar
          </button>
        </div>
      )}

      {/* 📦 LISTA DE PEDIDOS */}
      {user && orders.length > 0 && (
        <div style={styles.grid}>
          {orders.map(order => (
            <div
              key={order.id}
              style={styles.card}
              onClick={() =>
                navigate("/order-detail", { state: order })
              }
            >
              <h3>Pedido #{order.id}</h3>

              <p style={styles.date}>{order.date}</p>

              <p>{order.items.length} productos</p>

              <h4 style={styles.total}>
                Total: S/. {order.total}
              </h4>

              <span style={styles.view}>Ver detalle →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s"
  },
  date: {
    color: "#777",
    fontSize: "14px"
  },
  total: {
    marginTop: "10px",
    color: "#28a745"
  },
  view: {
    display: "block",
    marginTop: "10px",
    color: "#ff6a00",
    fontWeight: "bold"
  },
  empty: {
    textAlign: "center",
    marginTop: "50px"
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#ff6a00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Orders;