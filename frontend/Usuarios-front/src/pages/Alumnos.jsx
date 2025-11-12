import { useState, useEffect } from "react";
import { useAuth } from "../Auth";

export function Alumnos() {
  const { token } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "" });
  const [editId, setEditId] = useState(null);

  const getAlumnos = async () => {
    const res = await fetch("http://localhost:3000/alumnos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlumnos(data.alumnos || []);
  };

  const createAlumno = async () => {
    await fetch("http://localhost:3000/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const updateAlumno = async (id) => {
    await fetch(`http://localhost:3000/alumnos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const deleteAlumno = async (id) => {
    if (!confirm("¿Eliminar este alumno?")) return;
    await fetch(`http://localhost:3000/alumnos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    getAlumnos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await updateAlumno(editId);
    else await createAlumno();
    setForm({ nombre: "", apellido: "", dni: "" });
    setEditId(null);
    getAlumnos();
  };

  const handleEdit = (alumno) => {
    setForm({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
    });
    setEditId(alumno.id);
  };

  useEffect(() => {
    getAlumnos();
  }, []);

  return (
    <main className="container">
      <h3>Gestión de Alumnos</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          required
        />
        <input
          placeholder="DNI"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
        {editId && (
          <button type="button" onClick={() => setEditId(null)}>
            Cancelar
          </button>
        )}
      </form>

      <table role="grid">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.apellido}</td>
              <td>{a.dni}</td>
              <td>
                <button onClick={() => handleEdit(a)}>✏️</button>{" "}
                <button onClick={() => deleteAlumno(a.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
