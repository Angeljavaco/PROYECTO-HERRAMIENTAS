import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

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
  };

  const handleLogin = () => {
    const user = users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!user) {
      alert("Credenciales incorrectas");
      return;
    }

    // 🔥 guardar sesión
    localStorage.setItem("user", user.name);

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1>🔐 Login</h1>

      <input
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        onChange={handleChange}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Ingresar
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "100px" },
  input: { display: "block", margin: "10px auto", padding: "10px" },
  button: {
    padding: "10px 20px",
    background: "#ff6a00",
    color: "white",
    border: "none"
  }
};

export default Login;