import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "gif", "jpeg"], carpeta = "") => {
  // Vamos a usar Promesas aqui para determinar cuando algo sale bien o mal porque son cosas que pueden pasar al subir archivos
  return new Promise((resolve, reject) => {

    // Aca vamos a recibir el archivo en lugar de usar su forma original sampleFile = req.files.sampleFile; / En este lugar lo ponemos ismplemente ocmo file
    const { archivo } = files;

    // A continuacion vamos a revisar que extension trae el archivo y par aello necesitamos leerlo y aplicarle un split para separarlo entre espacio, comas, etc
    const nombrePortado = archivo.name.split("."); // lo separamos entre puntso en este caso

    // lo vemos en la consola
    console.log(nombrePortado);

    // Ahora vamos a tomar la extension, recordadr que es la ultima palabra generalmente despues del ultimo punto
    const extension = nombrePortado[nombrePortado.length - 1];

    // Ahora validamos lo que se esta subiendo contra nuestras restricciones y si no se cumple mandamos un mensjae
    if (!extensionesValidas.includes(extension)) {
      // Si la extension no es valida entonces usamos el reject
      return reject(`La extension ${extension} no esta permitida. Solo se permiten: ${extensionesValidas}`);
    }

    // Ahora le vamos a crear un ID, o un nombre temporal con formato id, unico a cada archivo que se sube para evitar mal functions, para eso usamos el paquete npm i uuid
    // y tambien le vamos a agregar la extension
    const nombreTemp = uuidv4() + "." + extension;

    // Aca construimos el path donde colocar el archivo y le agregamos el const. Para eso impotamos path de path
    // con esto ubicaremos correctamente nuestra carpeta uploads
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp); // name es el nombre del archivo que subimos, se puede ver en la consola, pero generamelnve vamos a usar su temporal name

    // Aca movemos el archivo a la carpeta uploads y tranformamos la funcion a una funcion de flecha
    archivo.mv(uploadPath, (err) => {
      if (err) {
        // si hay un problema mandamos un reject
        reject(err);
      }

      // Finalmente si todo sale bien ponemos la respuesta de que todo salio bien y la ruta donde se guardo el archivo
      resolve(nombreTemp);
    });
  });
};

export { subirArchivo };
