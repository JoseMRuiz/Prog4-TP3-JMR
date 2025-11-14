import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res, next) => {
  const [rows] = await db.execute("SELECT * FROM alumnos");
  res.json({ success: true, alumnos: rows });
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res, next) => {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM alumnos WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Alumno no encontrado" });
    res.json({ success: true, alumno: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser texto"),
  body("apellido")
    .notEmpty().withMessage("El apellido es obligatorio")
    .isString().withMessage("El apellido debe ser texto"),
  body("dni")
    .notEmpty().withMessage("El DNI es obligatorio")
    .isNumeric().withMessage("El DNI debe ser numérico")
    .isLength({ min: 7, max: 8 }).withMessage("El DNI debe tener entre 7 y 8 dígitos"),
  verificarValidaciones,
  async (req, res, next) => {
    const { nombre, apellido, dni } = req.body;

    const [existe] = await db.execute("SELECT id FROM alumnos WHERE dni = ?", [dni]);
    if (existe.length)
      return res.status(400).json({ success: false, message: "DNI duplicado" });

    const [result] = await db.execute(
      "INSERT INTO alumnos (nombre, apellido, dni) VALUES (?, ?, ?)",
      [nombre, apellido, dni]
    );

    res.status(201).json({
      success: true,
      alumno: { id: result.insertId, nombre, apellido, dni },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre")
    .optional()
    .isString().withMessage("El nombre debe ser texto")
    .notEmpty().withMessage("El nombre no puede estar vacío"),
  body("apellido")
    .optional()
    .isString().withMessage("El apellido debe ser texto")
    .notEmpty().withMessage("El apellido no puede estar vacío"),
  body("dni")
    .optional()
    .isNumeric().withMessage("El DNI debe ser numérico")
    .isLength({ min: 7, max: 8 }).withMessage("El DNI debe tener entre 7 y 8 dígitos"),
  verificarValidaciones,
  async (req, res, next) => {
    const { id } = req.params;
    const { nombre, apellido, dni } = req.body;

    const [rows] = await db.execute("SELECT * FROM alumnos WHERE id = ?", [id]);

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Alumno no encontrado" });

    await db.execute(
      "UPDATE alumnos SET nombre=?, apellido=?, dni=? WHERE id=?",
      [
        nombre || rows[0].nombre,
        apellido || rows[0].apellido,
        dni || rows[0].dni,
        id,
      ]
    );

    res.json({ success: true, message: "Alumno actualizado" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res, next) => {
    const { id } = req.params;
    await db.execute("DELETE FROM alumnos WHERE id=?", [id]);
    res.json({ success: true, message: "Alumno eliminado" });
  }
);

export default router;
