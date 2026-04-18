import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state;

  if (!product) {
    return <h2>Producto no encontrado</h2>;
  }

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div style={styles.card}>
        <img src={product.image} style={styles.image} />

        <div>
          <h1>{product.name}</h1>
          <h2>S/. {product.price}</h2>

          <p style={styles.desc}>
            Producto de alta calidad ideal para uso diario. 
            Excelente rendimiento y durabilidad.
          </p>

          <button style={styles.button}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial"
  },
  back: {
    marginBottom: "20px",
    padding: "10px",
    border: "none",
    background: "#333",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    display: "flex",
    gap: "40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  image: {
    width: "300px",
    borderRadius: "10px"
  },
  desc: {
    marginTop: "10px",
    color: "#555"
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#ff6a00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default ProductDetail;