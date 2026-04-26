import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser("");
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        🛍️ TienditaDonPepe
      </h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar productos..."
        style={styles.search}
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* USUARIO + BOTONES */}
      <div style={styles.userBox}>
        {user ? (
          <>
            <span style={styles.user}>Hola, {user} 👋</span>

            <button style={styles.btn} onClick={logout}>
              Salir
            </button>

            <button style={styles.btn} onClick={() => navigate("/orders")}>
              Pedidos
            </button>
          </>
        ) : (
          <button style={styles.btn} onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    flexWrap: "wrap", // 🔥 clave para responsive
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: "#00A650",
    color: "white",
    gap: "10px"
  },

  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: "18px"
  },

  search: {
    width: "100%", // 🔥 baja en móvil
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  userBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  btn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "white",
    color: "#333",
    fontWeight: "bold"
  },

  user: {
    fontSize: "12px"
  }
};

export default Navbar;