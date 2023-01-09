import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";

const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    // Solo almacenamos en el payload el unique identifactor uid  para evitar que nos roben info
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h"
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(" No se pudeo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = async ( token = '' ) => {

  // hacemos un try catch para intentar ver si hay token
  try{

    // Reivsamos si hay token 
    if (token.length <= 10 ) {
      // si estamos aca es porque no es un token ya que estos son super largos
      return null;
    }

    // Vemos is podemos desencriptar, si esto da error ya pasa al catch directamente, pero si fuciona es porque exite el uid
    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

    // vemos quien es
    const usuario = await Usuario.findById(uid)

    // Vemos si existe el usuario
    if ( usuario ) {
      // vemos que no haya sido elimiando
      if (usuario.estado ){
        // si pasa todo eso lo devolvemos
        return usuario; 
      } else {
        return null
      }
    } else {
      return null;
    }
  } catch (error){
    return null;
  }

}



export { generarJWT, comprobarJWT };
