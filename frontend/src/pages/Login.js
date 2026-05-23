import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const users = [
    { email: "angel@test.com", password: "1234", name: "Angel", phone: "+51987654321" },
    { email: "admin@test.com", password: "admin", name: "Admin", phone: "+51912345678" },
    { email: "fernandito@test.com", password: "Fernandini", name: "Fernandini", phone: "+51999888777" }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }

    const user = users.find(
      (item) => item.email === form.email && item.password === form.password
    );

    if (!user) {
      setError("Correo o contrasena incorrectos");
      return;
    }

    localStorage.setItem("user", user.name);
    localStorage.setItem("userProfile", JSON.stringify({
      name: user.name,
      email: user.email,
      phone: user.phone
    }));
    navigate("/");
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <p className="eyebrow">Acceso de cliente</p>
        <h1>Gestiona tus compras en un entorno mas claro y moderno.</h1>
        <p>
          Inicia sesion para revisar tus pedidos, continuar compras guardadas y tener una experiencia mas ordenada.
        </p>
      </section>

      <section className="auth-side">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Iniciar sesion</h2>
          <p>Usa tu correo y contrasena para entrar a la tienda.</p>

          <div className="form-group">
            <label htmlFor="email">Correo electronico</label>
            <input
              id="email"
              className="form-input"
              name="email"
              type="email"
              placeholder="angel@test.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contrasena</label>
            <div className="password-wrap">
              <input
                id="password"
                className="form-input"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contrasena"
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
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
