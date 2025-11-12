import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();


router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email FROM usuarios");
  res.json({ success: true, usuarios: rows });
});


router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id=?",
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

// Crear usuario
router.post(
  "/",
  body("nombre", "Nombre inválido")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),
  body("email", "Email inválido")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .isLength({ max: 90 })
    .withMessage("El email no puede tener más de 90 caracteres"),
  body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, email },
    });
  }
);


router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre", "Nombre inválido")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),
  body("email", "Email inválido")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .isLength({ max: 100 })
    .withMessage("El email no puede tener más de 90 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    const [usuarios] = await db.execute("SELECT id FROM usuarios WHERE id=?", [
      id,
    ]);

    if (usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    await db.execute("UPDATE usuarios SET nombre=?, email=? WHERE id=?", [
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

    await db.execute("DELETE FROM usuarios WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;
