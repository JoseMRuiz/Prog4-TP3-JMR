import { useState, useEffect } from "react";
import { useAuth } from "../Auth";

export default function Alumnos() {
  const { token } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "" });
  const [editId, setEditId] = useState(null);

  const fetchAlumnos = async () => {
    const res = await fetch(`http://localhost:3000/alumnos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlumnos(data.alumnos || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3000/alumnos/${editId}`
      : `http://localhost:3000/alumnos`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ nombre: "", apellido: "", dni: "" });
    setEditId(null);
    fetchAlumnos();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este alumno?")) return;
    await fetch(`http://localhost:3000/alumnos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAlumnos();
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
    fetchAlumnos();
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
                <button onClick={() => handleDelete(a.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
