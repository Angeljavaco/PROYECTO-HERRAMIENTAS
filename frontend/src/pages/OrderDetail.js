import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state;

  if (!order) {
    return <p>No hay información del pedido</p>;
  }

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h1>📦 Detalle del Pedido</h1>

      <div style={styles.card}>
        <p><b>ID:</b> {order.id}</p>
        <p><b>Fecha:</b> {order.date}</p>

        <h3>Productos:</h3>

        {order.items.map((item, i) => (
          <div key={i} style={styles.item}>
            <img src={item.image} style={styles.image} />

            <div>
              <p>{item.name}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>S/. {item.price}</p>
            </div>
          </div>
        ))}

        <h2>Total: S/. {order.total}</h2>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px"
  },
  back: {
    marginBottom: "20px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ccc",
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  item: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    alignItems: "center"
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px"
  }
};

export default OrderDetail;