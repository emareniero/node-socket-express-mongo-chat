import { response } from "express";
import { Categoria } from "../models/index.js";

// obtenerCategorias - paginado - total - populate (ultimo usuario que ha cambiado los datos)
const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = {
    estado: true,
  };

  const [totalRegistros, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).populate("usuario", "nombre").skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    totalRegistros,
    categorias,
  });
};

// obtenerCategoria - pupulate {}
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json(categoria);
};

const crearCategoria = async (req, res = response) => {
  // En el curso se recomienda grabar las categorias con mayusculas
  const nombre = req.body.nombre.toUpperCase();

  // Revisamos si la categoria ya existe en la BD
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe en la BD`,
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id, // Recordar que asi lo guarda mongo
  };

  // Guardar la info
  const categoria = await new Categoria(data);
  await categoria.save();

  // Ver la respuesta
  res.json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;

  // Aca sacamos el estado y el usario para que nadie externamente lo pueda cambiar
  const { estado, usuario, ...data } = req.body;

  // A continuacion grabamos el nombre que viene en el body que es el que quieren actualizar en UpperCase
  data.nombre = data.nombre.toUpperCase();

  // Ahora vemos quien fue el que hizo esta actualizacion
  data.usuario = req.usuario._id;

  // Ahora actualiazamos los datos con el id que recibimos del parametro  y los datos que vinieron en el body
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  // Finalmente enviamos la respuesta
  res.json(categoria);
};

// borrarCategoria - estado: falso
const borrarCategoria = async (req, res = response) => {
  // Buscamos que id se quiere borrar
  const { id } = req.params;

  // Buscamos que producto coincide con ese id y le cambias el estado a false (el new es para que se vean reflejados los cambios en la respuesta json)
  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

  // Enviamos la respuesta
  res.json(categoriaBorrada);
};

export { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria };
