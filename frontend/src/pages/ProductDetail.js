import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state;

  if (!product) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="container page-header">
          <h1>Producto no encontrado</h1>
          <p>No recibimos informacion del producto seleccionado.</p>
          <button className="btn btn-brand" onClick={() => navigate("/")}>
            Volver a la tienda
          </button>
        </main>
      </div>
    );
  }

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const addToCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cartData.find((item) => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cartData.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cartData));
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <div className="page-header">
          <div className="back-row">
            <button className="btn btn-ghost" onClick={() => navigate("/")}>
              Volver
            </button>
          </div>
          <p className="eyebrow">Detalle de producto</p>
        </div>

        <section className="detail-layout">
          <div className="detail-media">
            <img src={product.image} alt={product.name} />
          </div>

          <article className="detail-panel">
            {product.discount && <span className="badge detail-discount">{product.discount}% OFF</span>}
            <h1>{product.name}</h1>
            <div className="price-row">
              {product.discount && <span className="old-price">S/. {product.price}</span>}
              <span className="price">S/. {finalPrice}</span>
            </div>
            <p className="muted">
              Producto seleccionado para uso diario, con buen rendimiento y una presentacion clara para comparar antes de comprar.
            </p>
            <button className="btn btn-primary" onClick={addToCart}>
              Agregar al carrito
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ProductDetail;
