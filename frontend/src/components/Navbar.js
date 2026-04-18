import React from "react";

function Navbar() {
  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>🛒 ShopPro</h2>

      <input 
        type="text" 
        placeholder="Buscar productos..."
        style={styles.search}
      />

      <div>
        <button style={styles.btn}>Login</button>
        <button style={styles.cart}>🧺</button>
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
    margin: 0
  },
  search: {
    width: "40%",
    padding: "8px",
    borderRadius: "8px",
    border: "none"
  },
  btn: {
    marginRight: "10px",
    padding: "8px",
    border: "none",
    borderRadius: "6px"
  },
  cart: {
    padding: "8px",
    border: "none",
    borderRadius: "6px"
  }
};

export default Navbar;