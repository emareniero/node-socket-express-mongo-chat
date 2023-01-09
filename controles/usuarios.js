import { response, request } from "express";
import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";

export { usuariosGet, usuariosPut, usuariosPost, usuariosDelete };

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = {
    estado: true,
  }; /* Esto permite solo cargar los datos con estado verdadero ya que los que tiene falso fueron "borrados de la base de datos"
  pero lo correcto es no borrar los datos sino mas bien ocultarlos para mantener la integridad referencial*/

  const [totalRegistros, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    totalRegistros,
    usuarios,
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params; // Pongo id porque es lo que puse en la ruta de put.

  // Si es que viene el _id se debe excluir tb!
  const { _id, password, google, correo, ...rest } = req.body;

  // Validar contra base de datos
  if (password) {
    // Encriptar el password (hacer el hash)
    const salt = bcryptjs.genSaltSync(); // Cantidad de vueltas que se le da a la encriptacion, a mas mejor, por default es 10
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest);

  res.json({
    // msg: "put API - Controlador",
    usuario,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar el password (hacer el hash)
  const salt = bcryptjs.genSaltSync(); // Cantidad de vueltas que se le da a la encriptacion, a mas mejor, por default es 10
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  // Con el  codigo siguiente eliminamos un usuario para la persona que este usando el backend
  // pero no comprometemos la integridad referencial de nuestra base de datos.
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};
