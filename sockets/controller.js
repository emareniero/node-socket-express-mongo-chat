import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generar-jwt.js ";
import { ChatMensajes } from "../models/chat-mensajes.js";

// Creamos una instancia de chat mensajes
const chatMensajes = new ChatMensajes();

// Creamos la constante para controlar los sockets
// hacemos el new socket para tener las ayudas\
// una vez terminada la codificacion borrar el new socket
const socketController = async (socket = new Socket(), io) => {
  // Recibimos el token del front end para ver si es un usario que pertenece a nuestro be
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);

  // Si no existe lo desconectamos
  if (!usuario) {
    return socket.disconnect();
  }

  // Agregamos el usuario conenctado
  chatMensajes.conectarUsuario(usuario);
  // Avisamos a todos los usuarios quien se conecto
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  socket.emit("recibir-mensaje", chatMensajes.ultimos10);

  // Conectar a una sala especial para gestionar los chats privados
  socket.join(usuario.id); // Salas: global, socket.id, usuario.id

  // Limpair cuando alguien se desconecta
  socket.on("disconnect", () => {
    // borramos el usuario que salioF
    chatMensajes.desconectarUsuario(usuario.id);
    // Avisamos a todos los usuarios quien se desconecto
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  // Escuchamos cuando un nuevo mensaje se envia
  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    // Revisamos si viene uid
    if (uid) {
      // si viene es porque estamos aca y es un mensaje privado
      socket.to(uid).emit("mensaje-privado", {de: usuario.nombre, mensaje})
    } else {
      // Si estamos aca es porque es un mensaje para todo el mundo
      // recibimos el mensaje
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
      //enviamos  mensaje a todos ahora
      io.emit("recibir-mensaje", chatMensajes.ultimos10);
    }
  });
};

export { socketController };
