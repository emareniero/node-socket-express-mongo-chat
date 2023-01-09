import { Router } from "express";
import { check } from "express-validator";
import { usuariosDelete, usuariosGet, usuariosPost, usuariosPut } from "../controles/usuarios.js";
import { esMailValido, esRoleValido, existeUsuarioPorID } from "../helpers/db-validators.js";

import { validarCampos, validarJWT, esAdminRole, tieneRol } from "../middlewares/index.js";

export const routerUsu = Router();

// Leer usuario de la db
routerUsu.get("/", usuariosGet); // Los middleware en las rutas se deben pasar como segundo argumento

// Actualizar un usuario de la db
routerUsu.put(
  "/:id",
  [check("id", "No es un ID valido").isMongoId(), check("id").custom(existeUsuarioPorID), check("rol").custom(esRoleValido), validarCampos],
  usuariosPut
);

// Crear un nuevo usuario en la db
routerUsu.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener mas de 6 digitos").isLength({ min: 6 }),
    check("correo", "Debe introducir un correo electrónico válido").isEmail(),
    check("correo").custom(esMailValido),
    //check("rol", "No es un rol permitido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("rol").custom(esRoleValido), // Se puede poner solo esRoleValido en lugar de (rol) => esRoleValido(rol) por las nuevas actuailzaciones ECS6
    validarCampos,
  ],
  usuariosPost
);

// Borrar un usuario de la db
routerUsu.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    tieneRol("ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorID),
    validarCampos,
  ],
  usuariosDelete
);

// No usamos esto aun!
routerUsu.patch("/", (req, res) => {
  res.json({
    msg: "patch API",
  });
});
