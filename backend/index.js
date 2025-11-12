import express from "express";
import cors from "cors";
import passport from "passport";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import alumnosRouter from "./alumnos.js";
import materiasRouter from "./materias.js";
import notasRouter from "./notas.js";
import authRouter, { authConfig } from "./auth.js";

conectarDB(); 

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(passport.initialize());


authConfig();


app.get("/", (req, res) => {
  res.send("API Gestión de Alumnos funcionando ✅");
});


app.use("/usuarios", usuariosRouter);
app.use("/alumnos", alumnosRouter);
app.use("/materias", materiasRouter);
app.use("/notas", notasRouter);
app.use("/auth", authRouter);


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
