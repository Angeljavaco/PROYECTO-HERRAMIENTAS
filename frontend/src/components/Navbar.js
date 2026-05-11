import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch = () => {} }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [admin, setAdmin] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAdmin = localStorage.getItem("admin");
    if (savedUser) setUser(savedUser);
    if (savedAdmin) setAdmin(savedAdmin);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser("");
    setAdmin("");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="container nav-inner">
        <button className="brand-button" onClick={() => navigate("/")}>
          <span className="brand-mark">TP</span>
          <span>Tiendita Don Pepe</span>
        </button>

        <input
          className="search-field"
          type="text"
          placeholder="Buscar laptops, monitores o accesorios"
          onChange={(e) => onSearch(e.target.value)}
        />

        <div className="nav-actions">
          {admin ? (
            <>
              <span className="hello">Admin, {admin}</span>
              <button className="btn btn-ghost" onClick={() => navigate("/admin")}>
                Panel
              </button>
              <button className="btn btn-primary" onClick={logout}>
                Salir
              </button>
            </>
          ) : user ? (
            <>
              <span className="hello">Hola, {user}</span>
              <button className="btn btn-ghost" onClick={() => navigate("/orders")}>
                Pedidos
              </button>
              <button className="btn btn-primary" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate("/admin-login")}>
                Admin
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Iniciar sesion
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
