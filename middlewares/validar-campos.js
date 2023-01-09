import { validationResult } from "express-validator";

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next(); // Le dice al middleware que siga con el siguiente controlador
};

export { validarCampos };
