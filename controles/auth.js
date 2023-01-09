import { json, response } from "express";
import bcryptjs from "bcryptjs";
import Usuario from "../models/usuario.js";
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

export { login, googleSignIn, renovarToken };

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    //const googleUser = await googleVerify( id_token );
    // console.log(googleUser)
    const { nombre, img, correo } = await googleVerify(id_token);

    // Verificar si el correo existe en la base de datos
    let usuario = await Usuario.findOne({ correo });

    // Chequeamos si el usuario no existe, de ser asi, hay que crearlo
    if (!usuario) {
      // Crear usuario ya que si estamos aca es  porque no existe
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Verificar el estado del usuario en mi BD porque pudo haber sido borrado por algun motivo
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador - Usuario bloqueado",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
      // msg: 'Todo bien! Google sign in iniciado correctamente',
      // id_token
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - correo",
      });
    }

    // Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - estado: false",
      });
    }

    // Verificar el password
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - password",
      });
    }

    // Generar JWT -- Recordadr instalar npm i jsonwebtoken
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const renovarToken = async (req, res = response ) => {

  // desestructuramos el usuario porque si estamos aca es porque el validador de JWT en routes me dejo pasar hasta aqui y me trae
  // un usuario validado
  const { usuario } = req;

   // Generar un nuevo JWT por si la persna quiere permanecer mas timepo
   const token = await generarJWT(usuario.id);

  // Mandamos el usuario para chequera
  res.json({
    usuario,
    token
  })


}

