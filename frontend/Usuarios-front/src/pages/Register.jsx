import { useState } from "react";

import { useNavigate } from "react-router-dom";

export function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrarse");

      setSuccess("Usuario creado correctamente. Ya puedes iniciar sesión.");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <main className="container">
      <article style={{ maxWidth: "400px", margin: "5rem auto" }}>
        <h3>Crear cuenta</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Registrarse</button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>
        )}

        <p style={{ marginTop: "1rem" }}>
          ¿Ya tenés cuenta?{" "}
          <a href="/login" style={{ textDecoration: "underline" }}>
            Iniciar sesión
          </a>
        </p>
      </article>
    </main>
  );
}
