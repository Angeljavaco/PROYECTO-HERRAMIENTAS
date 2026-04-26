import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);

  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    fetch("http://localhost:8080/OnlineStoreApp/ProductController")
      .then(res => res.json())
      .then(data => {
        const updated = data.map(p => {
          let category = "otros";

          if (p.name.toLowerCase().includes("laptop")) category = "laptops";
          else if (p.name.toLowerCase().includes("mouse")) category = "accesorios";
          else if (p.name.toLowerCase().includes("teclado")) category = "accesorios";
          else if (p.name.toLowerCase().includes("monitor")) category = "pantallas";

          if ([1,3,5].includes(p.id)) {
            return { ...p, discount: 50, category };
          }

          return { ...p, category };
        });

        setProducts(updated);
      });
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const filteredProducts = products.filter(p => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || p.category === category) &&
      p.price <= maxPrice
    );
  });

  const addToCart = (product) => {
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cartData.find(item => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cartData.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart(cartData);

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 700);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, p) => {
    const price = p.discount
      ? p.price - (p.price * p.discount) / 100
      : p.price;

    return sum + price * (p.quantity || 1);
  }, 0);

  function Card({ p }) {
    const finalPrice = p.discount
      ? p.price - (p.price * p.discount) / 100
      : p.price;

    return (
      <div style={styles.card}>
        {p.discount && <div style={styles.badge}>🔥 {p.discount}% OFF</div>}

        <img src={p.image} alt={p.name} style={styles.image} />

        <h3 style={styles.productName}>{p.name}</h3>

        {p.discount ? (
          <>
            <p style={styles.oldPrice}>S/. {p.price}</p>
            <p style={styles.discountPrice}>S/. {finalPrice}</p>
          </>
        ) : (
          <p style={styles.price}>S/. {p.price}</p>
        )}

        <button
          style={{
            ...styles.button,
            background: addedId === p.id ? "#2ecc71" : "#ff6a00"
          }}
          onClick={() => addToCart(p)}
        >
          {addedId === p.id ? "✔" : "Agregar"}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar onSearch={setSearch} />

      <h1 style={styles.title}>🛍️ TienditaDonPepe</h1>

      <div style={styles.banner}>
        🔥 Ofertas del día - Hasta 50% OFF 🔥
      </div>

      {/* CATEGORÍAS */}
      <div style={styles.categories}>
        {["all", "laptops", "accesorios", "pantallas"].map(cat => (
          <button
            key={cat}
            style={{
              ...styles.catBtn,
              background: category === cat ? "#00A650" : "#eee",
              color: category === cat ? "white" : "black"
            }}
            onClick={() => setCategory(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FILTRO */}
      <div style={styles.filterBox}>
        <label>Precio máximo: S/. {maxPrice}</label>
        <input
          type="range"
          min="0"
          max="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* DESTACADOS */}
      <h2 style={styles.sectionTitle}>⭐ Destacados</h2>
      <div style={styles.featuredGrid}>
        {filteredProducts.filter(p => p.discount).slice(0, 3).map(p => (
          <Card key={p.id} p={p} />
        ))}
      </div>

      {/* PRODUCTOS */}
      <h2 style={styles.sectionTitle}>🛍️ Productos</h2>
      <div style={styles.grid}>
        {filteredProducts.map(p => (
          <Card key={p.id} p={p} />
        ))}
      </div>

      {/* CARRITO */}
      <div style={styles.cart}>
        <h2>🧺 Carrito</h2>

        {cart.length === 0 ? (
          <p>Vacío</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} style={styles.cartItem}>
              <span>{item.name}</span>
              <span>S/. {item.price} x {item.quantity}</span>
              <button onClick={() => removeFromCart(i)}>❌</button>
            </div>
          ))
        )}

        <h3>Total: S/. {total}</h3>

        {cart.length > 0 && (
          <button style={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
            💳 Comprar
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "15px",
    background: "#f2f2f2"
  },

  title: {
    textAlign: "center",
    fontSize: "22px"
  },

  banner: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px"
  },

  categories: {
    display: "flex",
    gap: "10px",
    overflowX: "auto"
  },

  catBtn: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  filterBox: {
    margin: "15px 0"
  },

  sectionTitle: {
    margin: "15px 0",
    fontSize: "18px"
  },

  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    position: "relative"
  },

  image: {
    width: "100%",
    height: "130px",
    objectFit: "contain"
  },

  productName: {
    fontSize: "13px"
  },

  badge: {
    position: "absolute",
    top: "5px",
    left: "5px",
    background: "red",
    color: "white",
    padding: "3px 6px",
    fontSize: "10px",
    borderRadius: "5px"
  },

  oldPrice: {
    textDecoration: "line-through",
    fontSize: "12px"
  },

  discountPrice: {
    color: "red",
    fontWeight: "bold"
  },

  price: {
    fontWeight: "bold"
  },

  button: {
    marginTop: "8px",
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    color: "white",
    fontSize: "12px"
  },

  cart: {
    marginTop: "30px",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px"
  },

  cartItem: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px"
  },

  checkoutBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#00A650",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }
};

export default Home;