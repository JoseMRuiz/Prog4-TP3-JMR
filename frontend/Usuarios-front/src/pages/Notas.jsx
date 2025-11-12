import { useState, useEffect } from "react";
import { useAuth } from "../Auth";

export default function Notas() {
  const { token } = useAuth();
  const [notas, setNotas] = useState([]);
  const [form, setForm] = useState({
    alumno_id: "",
    materia_id: "",
    nota1: "",
    nota2: "",
    nota3: "",
  });
  const [editId, setEditId] = useState(null);

  const getNotas = async () => {
    const res = await fetch("http://localhost:3000/notas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotas(data.notas || []);
  };

  const createNota = async () => {
    await fetch("http://localhost:3000/notas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const updateNota = async (id) => {
    await fetch(`http://localhost:3000/notas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const deleteNota = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await fetch(`http://localhost:3000/notas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    getNotas();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await updateNota(editId);
    else await createNota();
    setForm({
      alumno_id: "",
      materia_id: "",
      nota1: "",
      nota2: "",
      nota3: "",
    });
    setEditId(null);
    getNotas();
  };

  const handleEdit = (nota) => {
    setForm({
      alumno_id: nota.alumno_id,
      materia_id: nota.materia_id,
      nota1: nota.nota1 || "",
      nota2: nota.nota2 || "",
      nota3: nota.nota3 || "",
    });
    setEditId(nota.id);
  };

  useEffect(() => {
    getNotas();
  }, []);

  return (
    <main className="container">
      <h3>Gestión de Notas</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="ID Alumno"
          value={form.alumno_id}
          onChange={(e) => setForm({ ...form, alumno_id: e.target.value })}
          required
        />
        <input
          placeholder="ID Materia"
          value={form.materia_id}
          onChange={(e) => setForm({ ...form, materia_id: e.target.value })}
          required
        />
        <input
          placeholder="Nota 1"
          value={form.nota1}
          onChange={(e) => setForm({ ...form, nota1: e.target.value })}
        />
        <input
          placeholder="Nota 2"
          value={form.nota2}
          onChange={(e) => setForm({ ...form, nota2: e.target.value })}
        />
        <input
          placeholder="Nota 3"
          value={form.nota3}
          onChange={(e) => setForm({ ...form, nota3: e.target.value })}
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
            <th>Alumno</th>
            <th>Materia</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.alumno}</td>
              <td>{n.materia}</td>
              <td>{n.nota1 ?? "-"}</td>
              <td>{n.nota2 ?? "-"}</td>
              <td>{n.nota3 ?? "-"}</td>
              <td>{n.promedio}</td>
              <td>
                <button onClick={() => handleEdit(n)}>✏️</button>{" "}
                <button onClick={() => deleteNota(n.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
