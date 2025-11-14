import { useState, useEffect } from "react";
import { useAuth } from "../Auth";

export default function Materias() {
  const { token } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState({ nombre: "", codigo: "", anio: "" });
  const [editId, setEditId] = useState(null);


  const getMaterias = async () => {
    const res = await fetch("http://localhost:3000/materias", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMaterias(data.materias || []);
  };


  const createMateria = async () => {
    await fetch("http://localhost:3000/materias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

  const updateMateria = async (id) => {
    await fetch(`http://localhost:3000/materias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
  };

 
  const deleteMateria = async (id) => {
    if (!confirm("¿Eliminar esta materia?")) return;
    await fetch(`http://localhost:3000/materias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    getMaterias();
  };

  const handleSubmit = async (e) => {

    if (!form.nombre?.trim())
  return window.alert("El nombre de la materia es obligatorio");

    if (form.nombre.trim().length < 3)
      return window.alert("El nombre debe tener al menos 3 caracteres");
    
    // CÓDIGO
    if (!form.codigo?.trim())
      return window.alert("El código es obligatorio");
    
    if (!/^[a-zA-Z0-9]+$/.test(form.codigo))
      return window.alert("El código debe contener solo letras y números");
    
    // AÑO
    if (!form.anio)
      return window.alert("El año es obligatorio");
    
    const anioNum = Number(form.anio);
    
    if (isNaN(anioNum))
      return window.alert("El año debe ser un número");
    
    if (anioNum < 1 || anioNum > 6)
      return window.alert("El año debe ser un número entre 1 y 6");

    e.preventDefault();
    if (editId) await updateMateria(editId);
    else await createMateria();

    setForm({ nombre: "", codigo: "", anio: "" });
    setEditId(null);
    getMaterias();
  };

  const handleEdit = (materia) => {
    setForm({
      nombre: materia.nombre,
      codigo: materia.codigo,
      anio: materia.anio,
    });
    setEditId(materia.id);
  };

  useEffect(() => {
    getMaterias();
  }, []);

  return (
    <main className="container">
      <h3>Gestión de Materias</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Código"
          value={form.codigo}
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          required
        />
        <input
          placeholder="Año"
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: e.target.value })}
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
            <th>Código</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((m) => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td>{m.codigo}</td>
              <td>{m.anio}</td>
              <td>
                <button onClick={() => handleEdit(m)}>✏️</button>{" "}
                <button onClick={() => deleteMateria(m.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
