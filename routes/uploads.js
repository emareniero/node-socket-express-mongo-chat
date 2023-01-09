import { Router } from "express";
import { check } from "express-validator";
import { actualizarImagenClodinary, cargarArchivo, mostraImagen } from "../controles/uploads.js";
import { coleccionesPermitidas } from "../helpers/db-validators.js";
import { validarArchivoSubir } from "../middlewares/validar-archivo.js";

import { validarCampos } from "../middlewares/validar-campos.js";

export const routerUploads = Router();

// Aca el / no significa que la ruta donde se va a carga el archivo sea esa
// simplmente es dodne sea que el servidor defina que quiere usar esta ruta como lo hemos hecho
routerUploads.post("/", validarArchivoSubir, cargarArchivo);

// Aca definimos vamos a crear la ruta para guardar la imagen de un usuario
routerUploads.put(
  "/:coleccion/:id",
  [
    // Validamos que haya archivos a subir
    validarArchivoSubir,
    // Validamos que el id que queremos actualizar sea efectivamente de un usuario de nuestra BD
    check("id", "El id debe ser un id de Mongo valido").isMongoId(),
    // Tambien, la coleccion debe ser valida, entonces la chequeamos
    check("coleccion").custom((c) => coleccionesPermitidas(c, ["usuarios", "productos"])),
    // Luego validamos los campos
    validarCampos,
  ],
  actualizarImagenClodinary
);
// ], actualizarImagen)

routerUploads.get(
  "/:coleccion/:id",
  [
    // Validamos que el id que queremos actualizar sea efectivamente de un usuario de nuestra BD
    check("id", "El id debe ser un id de Mongo valido").isMongoId(),
    // Tambien, la coleccion debe ser valida, entonces la chequeamos
    check("coleccion").custom((c) => coleccionesPermitidas(c, ["usuarios", "productos"])),
    // Luego validamos los campos
    validarCampos,
  ],
  mostraImagen
);
