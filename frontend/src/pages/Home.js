import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // 🔥 Obtener productos del backend
  useEffect(() => {
    fetch("http://localhost:8080/OnlineStoreApp/ProductController")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // 🛒 Agregar al carrito
  const addToCart = (product, e) => {
    e.stopPropagation(); // 🔥 evita que se active el click de la card
    setCart([...cart, product]);
  };

  // ❌ Eliminar del carrito
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // 💰 Total
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={styles.container}>
      <Navbar />

      <h1 style={styles.title}>🛒 Tienda Online</h1>

      {/* 🧾 PRODUCTOS */}
      <div style={styles.grid}>
        {products.map((p) => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => navigate("/product", { state: p })}
          >
            <img src={p.image} alt={p.name} style={styles.image} />

            <h2>{p.name}</h2>
            <p style={styles.price}>S/. {p.price}</p>

            <button
              style={styles.button}
              onClick={(e) => addToCart(p, e)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {/* 🧺 CARRITO */}
      <div style={styles.cart}>
        <h2>🧺 Carrito</h2>

        {cart.length === 0 ? (
          <p>Carrito vacío</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} style={styles.cartItem}>
              <span>{item.name}</span>
              <span>S/. {item.price}</span>

              <button
                style={styles.remove}
                onClick={() => removeFromCart(i)}
              >
                ❌
              </button>
            </div>
          ))
        )}

        <h3>Total: S/. {total}</h3>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    padding: "20px",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "32px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s"
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px"
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50"
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ff6a00",
    color: "white",
    cursor: "pointer"
  },
  cart: {
    marginTop: "40px",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px",
    borderBottom: "1px solid #ddd"
  },
  remove: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 8px",
    cursor: "pointer"
  }
};

export default Home;