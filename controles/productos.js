import { response } from "express";
import { Producto } from "../models/index.js";

// Primero que nada vamos a obtener todos los productos
const obtenerPorudctos = async (req, res = response) => {
  // Con la siguiente liena vamos a ver algunos argumentos para evitar buscar tanta info en la BD
  const { limite = 5, desde = 0 } = req.query;

  // Con la siugiente lineas validamos que solo cargamos productos que no esten "borrados"
  const query = { estado: true };

  // A continuacion vamos a buscar todos los productos y contarlos
  const [totalRegistros, productos] = await Promise.all([
    // En esta linea contamos el total de registros
    Producto.countDocuments(query),
    // Aca listamos los productos, quien los registro y que categoria son
    Producto.find(query).populate("usuario", "nombre").populate("categoria", "nombre").skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    totalRegistros,
    productos,
  });
};

// obtenerProducto - pupulate {}
const obtenerProducto = async (req, res = response) => {
  // Buscamos que id esta vieniendo en los parametros de la peticion
  const { id } = req.params;

  // Nos fijamos cual producto es, vemos que usuario lo esta mandando agregando el nombre del mismo y la categoria
  const producto = await Producto.findById(id).populate("usuario", "nombre").populate('categoria', 'nombre');

  // Enviamos la respuesta
  res.json(producto);
};

// En las siguientes lineas de codigo vamos a crear un nuevo producto
// Primero creamos una funcion asincrona para recibir los datos
const  crearProducto = async ( req, res = response ) => {

    // QUitamos del request lo que no deberira interesar
    const { estado, usuario, ...body } = req.body

    // Primero que nada recibamos el nombre del producto agrabar, el mismo viene el body del request
    const nombre = req.body.nombre.toUpperCase();

    // Ahora chequeamos si el producto existe en la base de datos
    const productoBD = await Producto.findOne({nombre});

    // Si existe el producto entonces no lo vamos a crear
    if ( productoBD ) {
        return res.status(400).json({
            msg: `El producto ${productoBD.nombre} ya existe en la BD`
        })
    }
    
    // Ahora, en caso que no existira, genramos la info a guardar
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    // Ahora si, guardamos la info en la BD
    const producto = new Producto(data);
    await producto.save();

    // Ahora vemos la respuesta 
    res.json(producto)

}

// actualizarCategoria
const actualizarProducto = async (req, res = response) => {

  // Buscamos el id que viene en los params
  const { id } = req.params;

  // Aca sacamos el estado y el usario para que nadie externamente lo pueda cambiar
  const { estado, usuario, ...data } = req.body;

  // A continuacion grabamos el nombre que viene en el body que es el que quieren actualizar en UpperCase, si es que viene
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  // Ahora vemos quien fue el que hizo esta actualizacion
  data.usuario = req.usuario._id;

  // Ahora actualiazamos los datos con el id que recibimos del parametro  y los datos que vinieron en el body
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  // Finalmente enviamos la respuesta
  res.json(producto);
};

// borrarProdcuto - estado: falso
const borrarProducto = async (req, res = response) => {
  // Buscamos que id se quiere borrar
  const { id } = req.params;

  // Buscamos que producto coincide con ese id y le cambias el estado a false (el new es para que se vean reflejados los cambios en la respuesta json)
  const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

  // Enviamos la respuesta
  res.json(productoBorrado);
};

export { obtenerPorudctos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto };
