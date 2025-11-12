import { useState } from "react";
import { useAuth } from "./Auth.jsx";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.token);
      navigate("/alumnos");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <main className="container">
      <article style={{ maxWidth: "400px", margin: "5rem auto" }}>
        <h3>Iniciar sesión</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="usuario@email.com"
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
          <button type="submit">Ingresar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </article>
    </main>
  );
}
