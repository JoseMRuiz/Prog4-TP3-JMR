import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM materias ORDER BY anio ASC, nombre ASC");
  res.json({ success: true, materias: rows });
});

router.post(
  "/",
  verificarAutenticacion,
  [
    body("nombre")
      .notEmpty().withMessage("El nombre de la materia es obligatorio")
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    body("codigo")
      .notEmpty().withMessage("El código es obligatorio")
      .isAlphanumeric().withMessage("El código debe contener solo letras y números"),
    body("anio")
      .notEmpty().withMessage("El año es obligatorio")
      .isInt({ min: 1, max: 6 }).withMessage("El año debe ser un número entre 1 y 6"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const { nombre, codigo, anio } = req.body;
    const [materiaExistente] = await db.execute("SELECT id FROM materias WHERE codigo = ?", [codigo]);
    if (materiaExistente.length > 0)
      return res.status(400).json({ success: false, message: "Ya existe una materia con ese código" });

    const [result] = await db.execute(
      "INSERT INTO materias (nombre, codigo, anio) VALUES (?, ?, ?)",
      [nombre, codigo, anio]
    );

    res.status(201).json({
      success: true,
      materia: { id: result.insertId, nombre, codigo, anio },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  [
    validarId,
    body("nombre")
      .optional()
      .isLength({ min: 3 })
      .withMessage("El nombre debe tener al menos 3 caracteres"),
    body("codigo")
      .optional()
      .isAlphanumeric()
      .withMessage("El código debe contener solo letras y números"),
    body("anio")
      .optional()
      .isInt({ min: 1, max: 6 })
      .withMessage("El año debe ser un número entre 1 y 6"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, anio } = req.body;
    const [materia] = await db.execute("SELECT * FROM materias WHERE id = ?", [id]);
    if (materia.length === 0)
      return res.status(404).json({ success: false, message: "Materia no encontrada" });

    await db.execute(
      "UPDATE materias SET nombre=?, codigo=?, anio=? WHERE id=?",
      [nombre || materia[0].nombre, codigo || materia[0].codigo, anio || materia[0].anio, id]
    );

    res.json({ success: true, message: "Materia actualizada correctamente" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  [validarId, verificarValidaciones],
  async (req, res) => {
    const { id } = req.params;
    const [materia] = await db.execute("SELECT * FROM materias WHERE id = ?", [id]);
    if (materia.length === 0)
      return res.status(404).json({ success: false, message: "Materia no encontrada" });

    await db.execute("DELETE FROM materias WHERE id = ?", [id]);
    res.json({ success: true, message: "Materia eliminada correctamente" });
  }
);

export default router;
