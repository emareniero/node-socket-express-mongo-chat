import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, login, renovarToken } from "../controles/auth.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jws.js";


export const routerAuth = Router();

routerAuth.post("/login",[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

routerAuth.post("/google",[
    check('id_token', 'id_token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

routerAuth.get('/', validarJWT, renovarToken)