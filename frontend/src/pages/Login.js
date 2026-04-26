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

  // 🔥 usuarios simulados
  const users = [
    { email: "angel@test.com", password: "1234", name: "Angel" },
    { email: "admin@test.com", password: "admin", name: "Admin" }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError(""); // limpia error al escribir
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }

    const user = users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    // 🔥 guardar sesión
    localStorage.setItem("user", user.name);

    navigate("/");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Iniciar Sesión</h1>

        <input
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={{ position: "relative" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <span
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* 🔥 ERROR BONITO */}
        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleLogin} style={styles.button}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa"
  },
  card: {
    width: "360px",
    padding: "40px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  title: {
    marginBottom: "25px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ff6a00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px"
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer"
  }
};

export default Login;