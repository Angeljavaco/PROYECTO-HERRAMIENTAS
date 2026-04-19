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
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        🛒 ShopPro
      </h2>

      <input
        type="text"
        placeholder="Buscar productos..."
        style={styles.search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div>
        {user ? (
          <>
            <span style={styles.user}>Hola, {user} 👋</span>
            <button style={styles.btn} onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <button style={styles.btn} onClick={() => navigate("/login")}>
            Login
          </button>
        )}
        <button onClick={() => navigate("/orders")}>
            Pedidos
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#ff6a00",
    color: "white"
  },
  logo: {
    margin: 0,
    cursor: "pointer"
  },
  search: {
    width: "40%",
    padding: "8px",
    borderRadius: "8px",
    border: "none"
  },
  btn: {
    marginLeft: "10px",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  user: {
    marginRight: "10px"
  }
};

export default Navbar;