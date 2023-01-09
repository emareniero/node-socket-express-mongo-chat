import { response } from "express"

const esAdminRole = (req, res = response, next) => {

    // Aca solo leemos la validas del usuario que viene de validar-jws en lugar de hacer todas las verificaciones que este ya hace
    // simplemente agregamos este codigo abajo del anterior ya que se ejecuta de manera secuenciual
    // y guarda la respuestas del usuario en el req

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el toquen primero'
        })
    }

    const {rol, nombre } = req.usuario;

    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es Administrador - No puede borrar informacion de la BD`
        })
    }


    next();

}

const tieneRol = ( ...roles ) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el toquen primero'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
              msg: `El servicio requiere uno de estos roles ${ roles }`  
            });
        }

        next();
    }

}


export { esAdminRole, tieneRol}

