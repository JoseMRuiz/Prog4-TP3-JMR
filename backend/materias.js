import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM materias");
  res.json({ success: true, materias: rows });
});

router.post(
  "/",
  verificarAutenticacion,
  body("nombre").notEmpty(),
  body("codigo").notEmpty(),
  body("anio").isInt(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, codigo, anio } = req.body;
    await db.execute(
      "INSERT INTO materias (nombre, codigo, anio) VALUES (?, ?, ?)",
      [nombre, codigo, anio]
    );
    res.status(201).json({ success: true, message: "Materia creada" });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, anio } = req.body;
    await db.execute(
      "UPDATE materias SET nombre=?, codigo=?, anio=? WHERE id=?",
      [nombre, codigo, anio, id]
    );
    res.json({ success: true, message: "Materia actualizada" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM materias WHERE id=?", [id]);
    res.json({ success: true, message: "Materia eliminada" });
  }
);

export default router;
