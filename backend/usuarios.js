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

router.post(
  "/",
  body("nombre").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?,?,?)",
      [nombre, email, hashed]
    );
    res.status(201).json({ success: true, message: "Usuario creado" });
  }
);

export default router;
