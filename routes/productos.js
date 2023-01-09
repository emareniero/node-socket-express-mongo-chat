import { Router } from "express";
import { check } from "express-validator";
import { crearProducto, obtenerPorudctos, borrarProducto, obtenerProducto, actualizarProducto } from "../controles/productos.js";
import { existeCategoriaPorId, existeProductoPorId } from "../helpers/db-validators.js";
import { validarCampos, validarJWT, esAdminRole } from "../middlewares/index.js";

export const routerProd = Router();

/**
 * Esta es la direccion de los pruductos
 * {{url}}/api/productos
 */

// En la siguiente linea obtenemos todos los productos - publico
routerProd.get("/", obtenerPorudctos);

// Con la siguiente linea vamos a obtener los productos por id
routerProd.get(
    "/:id",
    [
      check('id', 'No es un id de Mongo valido').isMongoId(),
      check('id').custom( existeProductoPorId ), // verificar si no existe la categira con un helper
      validarCampos
    ],
    obtenerProducto
  );


// Con la siguiente linea vamos a crear un producto
routerProd.post("/", [
    validarJWT,
    check("nombre", "El nombre del producto es obligatioro").not().isEmpty(),
    check("categoria", "No es un id de Mongo").isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto)

// Actualizar un producto por id - privado - cualquier persona con un token valido
routerProd.put("/:id",[
    // Verificamos que sea un token valido
    validarJWT,
    // Ahora revisamos que el id existe para verificar que exista la categoria que se quiere cambiar
    check('id').custom( existeProductoPorId ),
    // Finalmente validamos campos para ver si nada trae error. Si hay algun problema no pasa de aqui
    validarCampos
], actualizarProducto);

// Borrar un producto - privilegios de ADMIN
routerProd.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);