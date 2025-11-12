import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT n.*, a.nombre AS alumno, m.nombre AS materia,
      ROUND((COALESCE(nota1,0)+COALESCE(nota2,0)+COALESCE(nota3,0))/3,2) AS promedio
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
  `);
  res.json({ success: true, notas: rows });
});

router.post(
  "/",
  verificarAutenticacion,
  body("alumno_id").isInt(),
  body("materia_id").isInt(),
  verificarValidaciones,
  async (req, res) => {
    const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;
    await db.execute(
      "INSERT INTO notas (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
      [alumno_id, materia_id, nota1 || null, nota2 || null, nota3 || null]
    );
    res.status(201).json({ success: true, message: "Notas cargadas" });
  }
);

export default router;
