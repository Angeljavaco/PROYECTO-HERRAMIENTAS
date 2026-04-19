import React, { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increase = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decrease = (id) => {
    const updated = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <h1>🧺 Carrito de Compras</h1>

      {cart.length === 0 ? (
        <p>Carrito vacío</p>
      ) : (
        cart.map(item => (
          <div key={item.id} style={styles.card}>
            <img src={item.image} style={styles.image} />

            <div>
              <h3>{item.name}</h3>
              <p>S/. {item.price}</p>

              <div>
                <button onClick={() => decrease(item.id)}>-</button>
                <span style={{ margin: "0 10px" }}>
                  {item.quantity}
                </span>
                <button onClick={() => increase(item.id)}>+</button>
              </div>
            </div>

            <button onClick={() => removeItem(item.id)} style={styles.remove}>
              ❌
            </button>
          </div>
        ))
      )}

      <h2>Total: S/. {total}</h2>
      <button 
  style={{
    marginTop: "20px",
    padding: "12px",
    width: "100%",
    background: "#ff6a00",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }}
  onClick={() => navigate("/checkout")}
>
  💳 Ir a pagar
</button>
    </div>
  );
}

const styles = {
  container: { padding: "30px" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "10px"
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover"
  },
  remove: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px"
  }
};

export default Cart;
<button onClick={() => window.location.href = "/checkout"}>
  Comprar ahora
</button>
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
