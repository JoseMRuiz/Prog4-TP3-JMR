import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Alumnos from "./pages/Alumnos";
import Materias from "./pages/Materias";
import Notas from "./pages/Notas";
import "./index.css";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login onLogin={() => setAuth(true)} />}
        />

        <Route
          path="/alumnos"
          element={auth ? <Alumnos /> : <Navigate to="/login" />}
        />
        <Route
          path="/materias"
          element={auth ? <Materias /> : <Navigate to="/login" />}
        />
        <Route
          path="/notas"
          element={auth ? <Notas /> : <Navigate to="/login" />}
        />

 
        <Route
          path="/"
          element={<Navigate to={auth ? "/alumnos" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
