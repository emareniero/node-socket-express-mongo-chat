// Referencias html
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

// Esta variable traera la info del usuario
let usuario = null;

// Esta vairable traear la info del socket
let socket = null;

// Url para el fetch
const url = window.location.hostname.includes("localhost") ? "http://localhost:8080/api/auth/" : "http://localhost:8080/api/auth/";

// Validar el token del localStorage
const validarJWT = async () => {
  //  leemos el token
  const token = localStorage.getItem("token") || "";

  // Si es un token con menos de 10 letras no me sirve
  if (token.length <= 10) {
    // redirigimos al usuario
    window.location = "index.html";
    // Devolvemos el error
    throw new Error("No hay token en el servidor");
  }

  // aca le mando el token al url para que busque el usuario
  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  // y aca extraemos la respuesta
  const { usuario: userDB, token: tokenDB } = await resp.json();

  // renovamos el JWT
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.usuario.nombre;

  // Aca esperamos la conexion con lo sokcet
  await conectarSocket();
};

const conectarSocket = async () => {
  // ocuapmos la instania del io que establece la comunicacoin con nuestro backend y le mandamos quien esta conectado
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  // Avisamos cuando el servidor esta activo
  socket.on("connect", () => {
    console.log("Sockets online");
  });

  // Avisamo cuando se cae el servidor
  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  // Avisamos cuando alguien recibe mensaje
  socket.on("recibir-mensaje", dibujarMensajes);

  // Avisamos cuando alguien recibe mensaje
  socket.on("usuarios-activos", dibujarUsuarios);

  // Mensajes privados
  socket.on("mensaje-privado", (payload) => {
    //TODO
    console.log('Privado:', payload)
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHTML = "";

  // Aplicamos el nombre de usuario y el id a cada
  usuarios.forEach((usuario) => {
    usersHTML += `
    <li>
      <p>
        <h5 class="text-success"> ${usuario.usuario.nombre} </h5>
        <span class="fs-6 text-muted"> ${usuario.usuario.uid} </span>
      </p>   
    </li>
  `;
  });

  ulUsuarios.innerHTML = usersHTML
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = "";

  // Aplicamos el nombre de usuario y el id a cada
  mensajes.forEach(({nombre, mensaje}) => {
    mensajesHTML += `
    <li>
      <p>
        <span class="text-primary"> ${nombre} </span>
        <span> ${mensaje} </span>
      </p>   
    </li>
  `;
  });

  ulMensajes.innerHTML = mensajesHTML
};

// Leemos la keycode de cada letra qie se presiona
txtMensaje.addEventListener('keyup', ({keyCode}) => {

  //constante que tiene el texto
  const mensaje = txtMensaje.value;
  //Constante que tiene el uid
  const uid = txtUid.value;

  // Aca ponemos que si no es la tecla enteer no se haga nad amas que escribir
  if ( keyCode !== 13 ) {return;}

  // Si el mensaje esta vacio no mandamos nada por as que aprete enter
  if ( mensaje.length === 0 ){return;}

  // Si presiono enter es porque quiero manda el mensaje al servidor entonces>
  socket.emit('enviar-mensaje', {mensaje, uid})

  // Limpiamos una vez enviado el mensaje
  txtMensaje.value = ''

})


// Creamos ahora la funcion para el chat y la vamos a llamar main
const main = async () => {
  // Primero que nada vamos a validar el JWT
  await validarJWT();
};
main();
