import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      n.id, 
      a.nombre AS alumno, 
      m.nombre AS materia,
      n.nota1, n.nota2, n.nota3,
      ROUND((COALESCE(n.nota1,0)+COALESCE(n.nota2,0)+COALESCE(n.nota3,0))/3,2) AS promedio
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
    ORDER BY a.nombre, m.nombre
  `);
  res.json({ success: true, notas: rows });
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.execute(
      `
      SELECT 
        n.id, 
        a.nombre AS alumno, 
        m.nombre AS materia,
        n.nota1, n.nota2, n.nota3,
        ROUND((COALESCE(n.nota1,0)+COALESCE(n.nota2,0)+COALESCE(n.nota3,0))/3,2) AS promedio
      FROM notas n
      JOIN alumnos a ON n.alumno_id = a.id
      JOIN materias m ON n.materia_id = m.id
      WHERE n.id = ?
    `,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Registro no encontrado" });

    res.json({ success: true, nota: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  [
    body("alumno_id")
      .isInt({ min: 1 })
      .withMessage("El ID del alumno debe ser un número entero válido"),
    body("materia_id")
      .isInt({ min: 1 })
      .withMessage("El ID de la materia debe ser un número entero válido"),
    body("nota1")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0, max: 10 })
      .withMessage("La nota 1 debe estar entre 0 y 10"),
    body("nota2")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0, max: 10 })
      .withMessage("La nota 2 debe estar entre 0 y 10"),
    body("nota3")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0, max: 10 })
      .withMessage("La nota 3 debe estar entre 0 y 10"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

    const [alumno] = await db.execute("SELECT id FROM alumnos WHERE id = ?", [alumno_id]);
    if (alumno.length === 0)
      return res.status(404).json({ success: false, message: "Alumno no encontrado" });

    const [materia] = await db.execute("SELECT id FROM materias WHERE id = ?", [materia_id]);
    if (materia.length === 0)
      return res.status(404).json({ success: false, message: "Materia no encontrada" });

    const [existente] = await db.execute(
      "SELECT id FROM notas WHERE alumno_id = ? AND materia_id = ?",
      [alumno_id, materia_id]
    );
    if (existente.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "Ya existen notas para este alumno y materia" });

    await db.execute(
      "INSERT INTO notas (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
      [alumno_id, materia_id, nota1 || null, nota2 || null, nota3 || null]
    );

    res.status(201).json({ success: true, message: "Notas registradas correctamente" });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  [
    validarId,
    body("nota1").optional().isFloat({ min: 0, max: 10 }).withMessage("Nota 1 inválida"),
    body("nota2").optional().isFloat({ min: 0, max: 10 }).withMessage("Nota 2 inválida"),
    body("nota3").optional().isFloat({ min: 0, max: 10 }).withMessage("Nota 3 inválida"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const { id } = req.params;
    const { nota1, nota2, nota3 } = req.body;

    const [nota] = await db.execute("SELECT * FROM notas WHERE id = ?", [id]);
    if (nota.length === 0)
      return res.status(404).json({ success: false, message: "Registro no encontrado" });

    await db.execute(
      "UPDATE notas SET nota1=?, nota2=?, nota3=? WHERE id=?",
      [nota1 ?? nota[0].nota1, nota2 ?? nota[0].nota2, nota3 ?? nota[0].nota3, id]
    );

    res.json({ success: true, message: "Notas actualizadas correctamente" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  [validarId, verificarValidaciones],
  async (req, res) => {
    const { id } = req.params;
    const [nota] = await db.execute("SELECT id FROM notas WHERE id = ?", [id]);
    if (nota.length === 0)
      return res.status(404).json({ success: false, message: "Registro no encontrado" });

    await db.execute("DELETE FROM notas WHERE id = ?", [id]);
    res.json({ success: true, message: "Notas eliminadas correctamente" });
  }
);

export default router;
