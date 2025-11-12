import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Listar alumnos
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM alumnos");
  res.json({ success: true, alumnos: rows });
});

// Obtener alumno por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM alumnos WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, alumno: rows[0] });
  }
);

// Crear alumno
router.post(
  "/",
  verificarAutenticacion,
  body("nombre").notEmpty(),
  body("apellido").notEmpty(),
  body("dni").notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni } = req.body;
    await db.execute(
      "INSERT INTO alumnos (nombre, apellido, dni) VALUES (?, ?, ?)",
      [nombre, apellido, dni]
    );
    res.status(201).json({ success: true, message: "Alumno creado" });
  }
);

// Actualizar alumno
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").notEmpty(),
  body("apellido").notEmpty(),
  body("dni").notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni } = req.body;
    await db.execute(
      "UPDATE alumnos SET nombre=?, apellido=?, dni=? WHERE id=?",
      [nombre, apellido, dni, id]
    );
    res.json({ success: true, message: "Alumno actualizado" });
  }
);

// Eliminar alumno
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM alumnos WHERE id=?", [id]);
    res.json({ success: true, message: "Alumno eliminado" });
  }
);

export default router;
