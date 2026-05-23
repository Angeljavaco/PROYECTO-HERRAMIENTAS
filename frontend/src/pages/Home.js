import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../utils/api";
import { mergeProductsForStore } from "../utils/products";

const categories = [
  { id: "all", label: "Todo" },
  { id: "laptops", label: "Laptops" },
  { id: "accesorios", label: "Accesorios" },
  { id: "pantallas", label: "Pantallas" }
];

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/ProductController"))
      .then((res) => res.json())
      .then((data) => {
        const updated = data.map((p) => {
          let productCategory = "otros";
          const name = p.name.toLowerCase();

          if (name.includes("laptop")) productCategory = "laptops";
          else if (name.includes("mouse") || name.includes("teclado")) productCategory = "accesorios";
          else if (name.includes("monitor")) productCategory = "pantallas";

          return {
            ...p,
            category: productCategory,
            discount: [1, 3, 5].includes(p.id) ? 50 : undefined
          };
        });

        setProducts(mergeProductsForStore(updated));
      })
      .catch(() => setProducts(mergeProductsForStore([])));
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const filteredProducts = products.filter((p) => (
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || p.category === category) &&
    Number(p.price) <= Number(maxPrice)
  ));

  const addToCart = (product) => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cartData.find((item) => item.id === product.id);

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
    const price = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
    return sum + price * (p.quantity || 1);
  }, 0);

  const activeCategory = categories.find((item) => item.id === category)?.label || "Todo";
  const featured = filteredProducts.filter((p) => p.discount).slice(0, 3);

  function ProductCard({ product }) {
    const finalPrice = product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;

    return (
      <article className="card">
        {product.discount && <span className="badge">{product.discount}% OFF</span>}

        <button
          className="product-media"
          onClick={() => navigate("/product", { state: product })}
          aria-label={`Ver detalle de ${product.name}`}
        >
          <img src={product.image} alt={product.name} />
        </button>

        <div className="card-body">
          <h3 className="product-name">{product.name}</h3>

          <div className="price-row">
            {product.discount && <span className="old-price">S/. {product.price}</span>}
            <span className="price">S/. {finalPrice}</span>
          </div>

          <div className="card-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/product", { state: product })}>
              Detalle
            </button>
            <button
              className={`btn ${addedId === product.id ? "btn-brand" : "btn-primary"}`}
              onClick={() => addToCart(product)}
            >
              {addedId === product.id ? "Agregado" : "Agregar"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="app-shell">
      <Navbar onSearch={setSearch} />

      <main className="container">
        <section className="hero">
          <div className="hero-panel">
            <p className="eyebrow">Tecnologia y accesorios</p>
            <h1 className="hero-title">Compra mejor, compara rapido y paga sin vueltas.</h1>
            <p className="hero-copy">
              Encuentra equipos seleccionados, ofertas visibles y un carrito claro para terminar tu compra con confianza.
            </p>
          </div>

          <aside className="summary-panel">
            <div>
              <p className="summary-label">Carrito actual</p>
              <p className="summary-value">S/. {total.toFixed(2)}</p>
              <p className="summary-note">
                {cart.length === 0 ? "Aun no agregaste productos." : `${cart.length} producto(s) listos para comprar.`}
              </p>
            </div>
            {cart.length > 0 && (
              <button className="btn btn-brand" onClick={() => navigate("/checkout")}>
                Ir a pagar
              </button>
            )}
          </aside>
        </section>

        <section className="toolbar">
          <div className="category-wrap">
            <button
              className="btn btn-brand category-toggle"
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              aria-expanded={categoryMenuOpen}
            >
              <span>{activeCategory}</span>
              <span>Menu</span>
            </button>

            <div className={`category-menu ${categoryMenuOpen ? "is-open" : ""}`}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${category === cat.id ? "chip-active" : ""}`}
                  onClick={() => {
                    setCategory(cat.id);
                    setCategoryMenuOpen(false);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-panel">
            <label className="filter-label" htmlFor="max-price">
              <span>Precio maximo</span>
              <strong>S/. {maxPrice}</strong>
            </label>
            <input
              id="max-price"
              className="range"
              type="range"
              min="0"
              max="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </section>

        {featured.length > 0 && (
          <>
            <div className="section-heading">
              <div>
                <h2>Destacados</h2>
                <p>Ofertas activas con mejor precio.</p>
              </div>
            </div>
            <section className="product-grid featured-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          </>
        )}

        <div className="section-heading">
          <div>
            <h2>Productos</h2>
            <p>{filteredProducts.length} resultado(s) encontrados.</p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">No encontramos productos con esos filtros.</div>
        ) : (
          <section className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}

        <section className="cart-panel section-panel">
          <div className="cart-header">
            <div>
              <h2>Carrito</h2>
              <p className="muted">Revisa cantidades y total antes de comprar.</p>
            </div>
            <strong className="price">S/. {total.toFixed(2)}</strong>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">Tu carrito esta vacio.</div>
          ) : (
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <div>
                    <p className="item-title">{item.name}</p>
                    <span className="item-meta">S/. {item.price} x {item.quantity}</span>
                  </div>
                  <button className="btn btn-icon" onClick={() => removeFromCart(index)} aria-label="Quitar producto">
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <button className="btn btn-brand" onClick={() => navigate("/checkout")}>
              Comprar ahora
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
