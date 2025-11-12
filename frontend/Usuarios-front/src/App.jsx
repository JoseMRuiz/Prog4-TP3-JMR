import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, AuthPage, useAuth } from "./Auth.jsx";
import { Login } from "./Login.jsx";
import { Alumnos } from "./Alumnos.jsx";
import { Materias } from "./Materias.jsx";
import { Notas } from "./Notas.jsx";
import "./index.css";

function Header() {
  const { token, logout } = useAuth();
  return (
    <header className="container" style={{ marginTop: "1rem" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        {token && (
          <>
            <Link to="/alumnos">Alumnos</Link>
            <Link to="/materias">Materias</Link>
            <Link to="/notas">Notas</Link>
            <button onClick={logout}>Salir</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/alumnos"
            element={
              <AuthPage>
                <Alumnos />
              </AuthPage>
            }
          />

          <Route
            path="/materias"
            element={
              <AuthPage>
                <Materias />
              </AuthPage>
            }
          />

          <Route
            path="/notas"
            element={
              <AuthPage>
                <Notas />
              </AuthPage>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
