import { response } from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Con esta linea de abajo le decimos a cloudinary que somos nosotros quienes estamos por usar el servicio
cloudinary.config(process.env.CLOUDINARY_URL);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from "../models/index.js";

// Esta funcion nos va a permitir cargar un archivo
const cargarArchivo = async (req, res = response) => {
  /**
   * Estas lineas de codigo se copian de la documentacion de git, en la carpeta example, de npm express-fileupload
   */

  // Para que el servidor no reviente le vamos a poner un try catch antes de intentar enviar algun archivo, si no puede que tire un error
  try {
    // Ahora enviamos los archivos que recibimos y las extensiones que queremos aceptar
    // Si ponemos undefined en el tipo de extension ira caulquiera que subamos siempre y cuando sean los permitidos en el controlador
    const nombre = await subirArchivo(req.files, ["txt", "pdf", "png"], "PNG");

    // Enviamos la respuesta
    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

// Aca definimos el controlador para actualizar la imagen del usuario
const actualizarImagen = async (req, res = response) => {
  // Primero sacamos de los params que vienen la info que necesitamos, es decir el id y la coleccion que es lo que defino en la ruta
  const { coleccion, id } = req.params;

  // Ahora vamos a crear una variable let porque la vamos a usar de manera condicional
  let modelo;

  // Ahora con un switch vamos a chequear la coleccion, basicamente para verque se quiere actualizar, si un usuario o un producto
  switch (coleccion) {
    case "usuarios":
      // revisemos que haya un usuario con el  id recibido
      modelo = await Usuario.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`,
        });
      }

      break;
    case "productos":
      // revisemos que haya un producto con el  id recibido
      modelo = await Producto.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }

      break;
    default:
      res.status(500).json({
        msg: `Se me olvido crear esta coleccion: ${coleccion}`,
      });
  }

  // En las siguientes lineas de codigo vamos a borrar archivos (imagenes en este caso) preexistentens para un mismo usuario o producto
  // primero revisamos que el modelo tenga la propiedad img antes que nada
  if (modelo.img) {
    // Buscamos la direccion donde esta almacenada la img | el .. en el uploads es para irse una carpeta atras ya que nuestro direname esta en controles ahora
    const pathArchivo = path.join(__dirname, "../uploads", coleccion, modelo.img);
    // preguntamos si existe el archivo, para eso importamos fs de fs (file system y le pasamos el psth
    if (fs.existsSync(pathArchivo)) {
      // si existe devuelve tru
      fs.unlinkSync(pathArchivo); // Asi lo borramos
    }
  }

  // Si el switch sale bien, recordar que modelo es un let porque puede ser usuarios o prodcutos entonces ahora toca guardarle el archivo
  // primero lo subimos a nuestro backend
  const archivo = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = archivo;

  // Ahora lo guardamos
  await modelo.save();

  // Aca enviamos la respuesta
  res.json(modelo);
};

// Aca definimos el controlador para actualizar la imagen del usuario
const actualizarImagenClodinary = async (req, res = response) => {
  // Primero sacamos de los params que vienen la info que necesitamos, es decir el id y la coleccion que es lo que defino en la ruta
  const { coleccion, id } = req.params;

  // Ahora vamos a crear una variable let porque la vamos a usar de manera condicional
  let modelo;

  // Ahora con un switch vamos a chequear la coleccion, basicamente para verque se quiere actualizar, si un usuario o un producto
  switch (coleccion) {
    case "usuarios":
      // revisemos que haya un usuario con el  id recibido
      modelo = await Usuario.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`,
        });
      }

      break;
    case "productos":
      // revisemos que haya un producto con el  id recibido
      modelo = await Producto.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }

      break;
    default:
      res.status(500).json({
        msg: `Se me olvido crear esta coleccion: ${coleccion}`,
      });
  }

  // En las siguientes lineas de codigo vamos a borrar archivos (imagenes en este caso) preexistentens para un mismo usuario o producto
  // primero revisamos que el modelo tenga la propiedad img antes que nada
  if (modelo.img) {
    // para borrar la imagen de cloudinary necesitamos el nombre de la imagen y para eso necesitamos extraer el nombre por los /
    const nombreArr = modelo.img.split('/')
    // Ahora tomamos el nombre
    const nombre = nombreArr[ nombreArr.length - 1];
    // Y ahora con una desestructuracion del nombre que le llamaremos public_id y su extension le quitamos la extension
    const [ public_id ] = nombre.split('.') // sepuede hacer un console log para ver esto si se desea estar seguro de estar haciendo bien
    // Ahora borramos la imagen de cloudinary
    cloudinary.uploader.destroy(public_id)
    console.log(public_id)

  }

  // Podemos encontrar el arhico almacendo de manera temporal en req.files.archivo.tempFilePath, se peude chequear en la consola para repasar
  const { tempFilePath } = req.files.archivo;
  console.log(req.files.archivo)

  // A continuacion subimos el archivo a cloudinary
  // const resp = await cloudinary.uploader.upload( tempFilePath ) // // dejo esta linea comentada porque esta bueno para ver de donde ssale el secure url
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

  // Si el switch sale bien, recordar que modelo es un let porque puede ser usuarios o prodcutos entonces ahora toca guardarle el archivo
  // primero lo subimos a nuestro backend
  modelo.img = secure_url;

  // // Ahora lo guardamos
  await modelo.save();

  // Aca enviamos la respuesta
  res.json(modelo);
};

// Ahora creo el controlador para mostrar imagenes
const mostraImagen = async (req, res = response) => {
  // Primero sacamos de los params que vienen la info que necesitamos, es decir el id y la coleccion que es lo que defino en la ruta
  const { coleccion, id } = req.params;

  // Ahora vamos a crear una variable let porque la vamos a usar de manera condicional
  let modelo;

  // Ahora con un switch vamos a chequear la coleccion, basicamente para verque se quiere actualizar, si un usuario o un producto
  switch (coleccion) {
    case "usuarios":
      // revisemos que haya un usuario con el  id recibido
      modelo = await Usuario.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`,
        });
      }

      break;
    case "productos":
      // revisemos que haya un producto con el  id recibido
      modelo = await Producto.findById(id);

      // Si no hay un id coincidente entonces el modelo no exite y no hay nada que actualizar
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }

      break;
    default:
      res.status(500).json({
        msg: `Se me olvido crear esta coleccion: ${coleccion}`,
      });
  }

  // En las siguientes lineas de codigo vamos a borrar archivos (imagenes en este caso) preexistentens para un mismo usuario o producto
  // primero revisamos que el modelo tenga la propiedad img antes que nada
  if (modelo.img) {
    // Buscamos la direccion donde esta almacenada la img | el .. en el uploads es para irse una carpeta atras ya que nuestro direname esta en controles ahora
    const pathArchivo = path.join(__dirname, "../uploads", coleccion, modelo.img);
    // preguntamos si existe el archivo, para eso importamos fs de fs (file system y le pasamos el psth
    if (fs.existsSync(pathArchivo)) {
      // si existe devuelve tru
      return res.sendFile(pathArchivo); // Como estamos obteniendo un archivo lo tenemos que deolver
    }
  }

  // En caso que no exita una imagen buscamos la imagen dentro de nuestro assets que avisa que no se encontro imagne y la enviamos como respuesta
  const noImage = path.join(__dirname, "../assets/no-image.jpg");

  // Aca enviamos la respuesta
  res.sendFile(noImage);
};

export { cargarArchivo, actualizarImagen, mostraImagen, actualizarImagenClodinary };
