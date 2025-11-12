import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();


router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM materias");
    res.json({ success: true, materias: rows });
  } catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
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
    try {
      const { nombre, codigo, anio } = req.body;

      // Validar que no exista una materia con el mismo código
      const [materiaExistente] = await db.execute(
        "SELECT id FROM materias WHERE codigo = ?",
        [codigo]
      );
      if (materiaExistente.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una materia con ese código",
        });
      }

      await db.execute(
        "INSERT INTO materias (nombre, codigo, anio) VALUES (?, ?, ?)",
        [nombre, codigo, anio]
      );

      res.status(201).json({ success: true, message: "Materia creada exitosamente" });
    } catch (error) {
      console.error("Error al crear materia:", error);
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
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
    try {
      const { id } = req.params;
      const { nombre, codigo, anio } = req.body;

   
      const [materia] = await db.execute("SELECT * FROM materias WHERE id = ?", [id]);
      if (materia.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Materia no encontrada",
        });
      }

      await db.execute(
        "UPDATE materias SET nombre = ?, codigo = ?, anio = ? WHERE id = ?",
        [nombre || materia[0].nombre, codigo || materia[0].codigo, anio || materia[0].anio, id]
      );

      res.json({ success: true, message: "Materia actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar materia:", error);
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
  }
);


router.delete(
  "/:id",
  verificarAutenticacion,
  [validarId, verificarValidaciones],
  async (req, res) => {
    try {
      const { id } = req.params;

      const [materia] = await db.execute("SELECT * FROM materias WHERE id = ?", [id]);
      if (materia.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Materia no encontrada",
        });
      }

      await db.execute("DELETE FROM materias WHERE id = ?", [id]);

      res.json({ success: true, message: "Materia eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar materia:", error);
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
  }
);

export default router;
