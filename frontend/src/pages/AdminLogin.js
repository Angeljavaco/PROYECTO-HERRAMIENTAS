import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const admins = [
  {
    email: "admin@tiendadonpepe.com",
    password: "Admin123",
    name: "Administrador"
  }
];

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const hasCorporateEmail = form.email.endsWith("@tiendadonpepe.com");

    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }

    if (!hasCorporateEmail) {
      setError("Usa tu correo corporativo @tiendadonpepe.com");
      return;
    }

    const admin = admins.find(
      (item) => item.email === form.email && item.password === form.password
    );

    if (!admin) {
      setError("Credenciales administrativas incorrectas");
      return;
    }

    localStorage.removeItem("user");
    localStorage.setItem("admin", admin.name);
    navigate("/admin");
  };

  return (
    <main className="auth-page admin-auth-page">
      <section className="auth-visual admin-visual">
        <p className="eyebrow">Acceso administrativo</p>
        <h1>Controla productos, precios y disponibilidad desde un solo panel.</h1>
        <p>
          La vista administrativa esta separada de la tienda para que el equipo pueda gestionar el catalogo con orden.
        </p>
      </section>

      <section className="auth-side">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Panel administrativo</h2>
          <p>Ingresa con tu correo corporativo y contrasena.</p>

          <div className="form-group">
            <label htmlFor="admin-email">Correo corporativo</label>
            <input
              id="admin-email"
              className="form-input"
              name="email"
              type="email"
              placeholder="admin@tiendadonpepe.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Contrasena</label>
            <div className="password-wrap">
              <input
                id="admin-password"
                className="form-input"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contrasena administrativa"
                value={form.password}
                onChange={handleChange}
              />
              <button
                className="btn btn-ghost password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary" type="submit">
            Entrar al panel
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
