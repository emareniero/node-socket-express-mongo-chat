import { response } from "express";

const validarArchivoSubir = (req, res = response, next) => {

    // Validamos que haya archivos por subir
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {

    // Si no hay archivos mandamos la resputa
    return res.status(400).json({ 
        msg: " No hay archivos que subir - validarArchivoSubir" 
    });
  }

  // Si hay archivos continuamos
  next();
};

export { validarArchivoSubir };
