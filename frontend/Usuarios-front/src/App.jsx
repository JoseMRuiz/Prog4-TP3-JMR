import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, AuthPage, useAuth } from "./Auth.jsx";
import { Login } from "./pages/Login.jsx";
import Alumnos from "./pages/Alumnos.jsx";
import Materias from "./pages/Materias.jsx";
import "./index.css";
import Notas from "./pages/Notas.jsx";
import { Register } from "./pages/Register.jsx";

function Header() {
  const { token, logout } = useAuth();
  return (
    <header className="container" style={{ marginTop: "1rem" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
       {token ? (
          <>
            <Link to="/alumnos">Alumnos</Link>
            <Link to="/materias">Materias</Link>
            <Link to="/notas">Notas</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link> 
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
           <Route path="/register" element={<Register />} /> 

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
