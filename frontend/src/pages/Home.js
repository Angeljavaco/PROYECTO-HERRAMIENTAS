import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null); // 🔥 animación botón

  // 🔥 Obtener productos
  useEffect(() => {
    fetch("http://localhost:8080/OnlineStoreApp/ProductController")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // 🔄 Cargar carrito
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // 🔍 Filtrar productos
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🛒 Agregar al carrito (con animación)
  const addToCart = (product) => {
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cartData.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cartData.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart(cartData);

    // 🔥 animación visual
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 800);
  };

  // ❌ Eliminar
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // 💰 Total
  const total = cart.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );

  return (
    <div style={styles.container}>
      <Navbar onSearch={setSearch} />

      <h1 style={styles.title}>🛒 Tienda Online</h1>

      {/* 🧾 PRODUCTOS */}
      <div style={styles.grid}>
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onClick={() => navigate("/product", { state: p })}
          >
            <img src={p.image} alt={p.name} style={styles.image} />

            <h2>{p.name}</h2>
            <p style={styles.price}>S/. {p.price}</p>

            {/* 🔥 BOTÓN CON ANIMACIÓN */}
            <button
              style={{
                ...styles.button,
                background: addedId === p.id ? "#2ecc71" : "#ff6a00",
                transform: addedId === p.id ? "scale(1.1)" : "scale(1)",
                transition: "0.3s"
              }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(p);
              }}
            >
              {addedId === p.id ? "✔ Agregado" : "Agregar al carrito"}
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
              <span>
                S/. {item.price} x {item.quantity || 1}
              </span>

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

        {cart.length > 0 && (
          <button
            style={styles.checkoutBtn}
            onClick={() => navigate("/checkout")}
          >
            💳 Comprar ahora
          </button>
        )}
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
    transition: "all 0.3s ease"
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
  },
  checkoutBtn: {
    marginTop: "20px",
    padding: "14px",
    width: "100%",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Home;