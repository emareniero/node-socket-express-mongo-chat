class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatMensajes {
  // creamos el constructor
  constructor() {
    this.mensajes = [];
    this.usuarios = {};
  }

  // Creamos un metodo ahora para traer solo los ultimos 10 mensajes al chat
  get ultimos10() {
    // cortamos los ultimos 10
    this.mensajes = this.mensajes.splice(0, 10);
    // los devolvemos
    return this.mensajes;
  }

  // Traemos los usuarios con el siguiente metodo
  get usuariosArr() {
    // Este metodo me deuvelve un arreglo de usuarios // [{}, {}, {}]
    return Object.values(this.usuarios);
  }

  // Creamos un metodo para enviar mensajes y su respectiva info
  enviarMensaje(uid, nombre, mensaje) {
    // metemos el mensaje al inicio del arreglo de mensajes
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  // Agregamos un metodo para agregar usuario
  conectarUsuario(usuario) {
    this.usuarios[usuario.id] = usuario;
  }

  // metodo  para desconecta usuaior
  desconectarUsuario(id) {
    delete this.usuarios[id];
  }
}

export { ChatMensajes }
