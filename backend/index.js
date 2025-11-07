import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import rolesRouter from "./roles.js";
import usuariosRolesRouter from "./usuarios-roles.js";
import authRouter, { authConfig } from "./auth.js";

conectarDB();

const app = express();
const port = 3000;


app.use(express.json());


app.use(cors());

authConfig();

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

app.use("/usuarios", usuariosRouter);
app.use("/roles", rolesRouter);
app.use("/usuarios-roles", usuariosRolesRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
