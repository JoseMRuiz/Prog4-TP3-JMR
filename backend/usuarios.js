import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();


router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email FROM usuarios");
  res.json({
    success: true,
    usuarios: rows,
  });
});


router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  }
);


router.post(
  "/",
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .isLength({ max: 100 })
    .withMessage("El email no puede tener más de 100 caracteres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
      
      const [existe] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      if (existe.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al crear el usuario",
      });
    }
  }
);


router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .isLength({ max: 100 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    const [usuarios] = await db.execute("SELECT id FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (usuarios.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute("UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?", [
      nombre,
      email,
      id,
    ]);

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: { id, nombre, email },
    });
  }
);


router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ success: true, message: "Usuario eliminado", id });
  }
);

export default router;
