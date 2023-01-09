import { response } from "express";
import mongoose from "mongoose";
import categoria from "../models/categoria.js";
import { Categoria, Producto, Usuario } from "../models/index.js";



const coleccionesPermitidas = ["usuarios", "categorias", "productos","productosPorCategoria", "roles"];

// Esta funcion es la que va a buscar el usuario que estamos intentando buscar
const buscarUsuarios = async (termino = "", res = response) => {
  // Primero vamos a ver si el termino que nos mandan es un MongoId valido por si quiere buscar  usuario por id
  const esMongoId = mongoose.Types.ObjectId.isValid(termino); // Si es TRUE es porque es un id que viene de la BD de Mongo

  // Si es id de mongo entones buscamos el usuario y devolemos su nombre
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    // Aca mandamos la respuesta en caso que exista usuario, si no existe mandamos algo vacio para que el FE sepa que no hay usuario
    // no olvidarse el return para que no siga ejecutando nada de la funcion
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  // Aca utilizacmos una expresion regular para poder buscar de manera insensible, medio dificl de entender pero se hace asi
  const regex = new RegExp(termino, "i"); // el termino es lo que buscamos y la 'i' es para que sea insensible a mayuscalas, minusculas, etc

  // En las siguientes lineas de codigo vamos a buscar los usuarioss por nombre
  const usuarios = await Usuario.find({
    // el or es una propiedad de Mongo, se puede ver todas las que hay poniendo solo $
    // Aca la usamos para  que el termino (regex) coincida ya sea con el nombre del usuario definido en el modelo o con su correo
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }], // esta se tiene que cumplir si o si
  });

  // Ahora mandamos las respuestas que coincinden con el nombre buscado, si no hay nombre retorna un arreglo vacio el find()
  res.json({
    results: usuarios,
  });
};

// Esta funcion es la que va a buscar el usuario que estamos intentando buscar
const buscarCategorias = async (termino = "", res = response) => {
    // Primero vamos a ver si el termino que nos mandan es un MongoId valido por si quiere buscar  usuario por id
    const esMongoId = mongoose.Types.ObjectId.isValid(termino); // Si es TRUE es porque es un id que viene de la BD de Mongo
  
    // Si es id de mongo entones buscamos el usuario y devolemos su nombre
    if (esMongoId) {
      const categoria = await Categoria.findById(termino);
      // Aca mandamos la respuesta en caso que exista usuario, si no existe mandamos algo vacio para que el FE sepa que no hay usuario
      // no olvidarse el return para que no siga ejecutando nada de la funcion
      return res.json({
        results: categoria ? [categoria] : [],
      });
    }
  
    // Aca utilizacmos una expresion regular para poder buscar de manera insensible, medio dificl de entender pero se hace asi
    const regex = new RegExp(termino, "i"); // el termino es lo que buscamos y la 'i' es para que sea insensible a mayuscalas, minusculas, etc
  
    // En las siguientes lineas de codigo vamos a buscar los usuarioss por nombre
    const categorias = await Categoria.find({ nombre: regex, estado: true });
  
    // Ahora mandamos las respuestas que coincinden con el nombre buscado, si no hay nombre retorna un arreglo vacio el find()
    res.json({
      results: categorias,
    });
  };

  // Esta funcion es la que va a buscar el usuario que estamos intentando buscar
const buscarProductos = async (termino = "", res = response) => {
  // Primero vamos a ver si el termino que nos mandan es un MongoId valido por si quiere buscar  usuario por id
  const esMongoId = mongoose.Types.ObjectId.isValid(termino); // Si es TRUE es porque es un id que viene de la BD de Mongo

  // Si es id de mongo entones buscamos el usuario y devolemos su nombre
  if (esMongoId) {
    const productos = await Producto.findById(termino).populate('categoria', 'nombre');
    // Aca mandamos la respuesta en caso que exista usuario, si no existe mandamos algo vacio para que el FE sepa que no hay usuario
    // no olvidarse el return para que no siga ejecutando nada de la funcion
    return res.json({
      results: productos ? [productos] : [],
    });
  }

  // Aca utilizacmos una expresion regular para poder buscar de manera insensible, medio dificl de entender pero se hace asi
  const regex = new RegExp(termino, "i"); // el termino es lo que buscamos y la 'i' es para que sea insensible a mayuscalas, minusculas, etc

  // En las siguientes lineas de codigo vamos a buscar los usuarioss por nombre
  const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

  // Ahora mandamos las respuestas que coincinden con el nombre buscado, si no hay nombre retorna un arreglo vacio el find()
  res.json({
    results: productos,
  });
};

// Esta funcion es la que va a buscar el usuario que estamos intentando buscar
const buscarProductosPorCategoria = async (termino = "", res = response) => {
  // Primero vamos a ver si el termino que nos mandan es un MongoId valido por si quiere buscar  usuario por id
  const esMongoId = mongoose.Types.ObjectId.isValid(termino); // Si es TRUE es porque es un id que viene de la BD de Mongo

  // Si es id de mongo entones buscamos el usuario y devolemos su nombre
  if (esMongoId) {
    const cateogria = await Categoria.findById(termino);
    // Aca mandamos la respuesta en caso que exista usuario, si no existe mandamos algo vacio para que el FE sepa que no hay usuario
    // no olvidarse el return para que no siga ejecutando nada de la funcion
    return res.json({
      results: cateogria ? [cateogria] : [],
    });
  }

  // Aca utilizacmos una expresion regular para poder buscar de manera insensible, medio dificl de entender pero se hace asi
  const regex = new RegExp(termino, "i"); // el termino es lo que buscamos y la 'i' es para que sea insensible a mayuscalas, minusculas, etc
  
  // En las siguientes lineas de codigo vamos a buscar los usuarioss por nombre
  const categoria = await Categoria.findOne({ nombre: regex, estado: true });

  // En las siguientes lineas de codigo vamos a buscar los usuarioss por nombre
  const productos = await Producto.find({
    // el or es una propiedad de Mongo, se puede ver todas las que hay poniendo solo $
    // Aca la usamos para  que el termino (regex) coincida ya sea con el nombre del usuario definido en el modelo o con su correo
    estado:true,
    $and: [{ 
      categoria: categoria._id 
    }], // esta se tiene que cumplir si o si
  }).populate('categoria', 'nombre');

  // Ahora mandamos las respuestas que coincinden con el nombre buscado, si no hay nombre retorna un arreglo vacio el find()
  res.json({
    results: productos,
  });
};








const buscar = (req, res = response) => {
  // Estraemos la coleccion y el termino de busqueda que vienen de los parametros de manera destructurada
  const { coleccion, termino } = req.params;

  // Verifiquemos que la coleccion recibida este incluida y sino la incluye que avise
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
        buscarCategorias(termino, res)
      break;
    case "productos":
      buscarProductos(termino, res)
      break;
    case "productosPorCategoria":
      buscarProductosPorCategoria(termino, res)
      break;


    // Siempre que se trabaja  con un switch es bueno tener una opcion por defecto en caso que algo salga mal y avisamos con un erro
    default:
      // Ponemos un 500 para saber que es problema de back end
      res.status(500).json({
        msg: "Esta busqueda aun no esta creada",
      });
  }
};

export { buscar };
