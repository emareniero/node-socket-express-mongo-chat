import { Router } from "express";
import { check } from "express-validator";
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from "../controles/categorias.js";
import { existeCategoriaPorId } from "../helpers/db-validators.js";
// import { validarCampos } from "../middlewares/validar-campos.js";
// import { validarJWT } from "../middlewares/validar-jws.js";
// import { esAdminRole } from "../middlewares/validar-roles.js";
import { validarCampos, validarJWT, esAdminRole } from "../middlewares/index.js";

export const routerCat = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
routerCat.get("/", [], obtenerCategorias);

// Obtener una categorias segun id - publico
// HACER MIDDLEWARE PERSONALIZADO PARA ID CATEGORIAS
routerCat.get(
  "/:id",
  [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ), // verificar si no existe la categira con un helper
    validarCampos
  ],
  obtenerCategoria
);

// Crear categoria - privado - cualquier persona con un token valido
routerCat.post("/", [validarJWT, check("nombre", "El nombre es obligatorio").not().isEmpty(), validarCampos], crearCategoria);

// Actualizar un registro por id - privado - cualquier persona con un token valido
routerCat.put("/:id",[
    // Verificamos que sea un token valido
    validarJWT,
    // Verificamos que venga nombre sino que vamos a actualizar
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // Ahora revisamos que el id existe para verificar que exista la categoria que se quiere cambiar
    check('id').custom( existeCategoriaPorId ),
    // Finalmente validamos campos para ver si nada trae error. Si hay algun problema no pasa de aqui
    validarCampos
], actualizarCategoria);

// Borrar una cateogira - privilegios de ADMIN
routerCat.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);
