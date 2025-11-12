import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();


export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, done) => {
      try {
        const [usuarios] = await db.execute(
          "SELECT id, nombre, email FROM usuarios WHERE id = ?",
          [payload.userId]
        );

        if (usuarios.length === 0) {
          return done(null, false);
        }

        return done(null, usuarios[0]);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});


router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { email, password } = req.body;

     
      const [usuarios] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );

      if (usuarios.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Usuario o contraseña inválidos",
        });
      }

      const usuario = usuarios[0];

      
      const passwordComparada = await bcrypt.compare(
        password,
        usuario.password
      );

      if (!passwordComparada) {
        return res.status(400).json({
          success: false,
          error: "Usuario o contraseña inválidos",
        });
      }

      
      const payload = {
        userId: usuario.id,
        userEmail: usuario.email,
      };

   
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });

     
      res.json({
        success: true,
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        error: "Error en el servidor durante el login",
      });
    }
  }
);

export default router;
