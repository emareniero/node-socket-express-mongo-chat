// Referencias a mi formulario
const miFormulario = document.querySelector("form");
const button = document.querySelector('#google_signout')

const url = window.location.hostname.includes("localhost") ? "http://localhost:8080/api/auth/" : "http://localhost:8080/api/auth/";

miFormulario.addEventListener("submit", (ev) => {
  // Se hace esto para evitar hacer un refresh del navegador
  ev.preventDefault();

  // Creamos una constante para almacenar la data del formulario
  const formData = {};

  // recibimos la data del forumlario
  for (let el of miFormulario.elements) {
    // revisamos si tiene info
    if (el.name.length > 0)
      // Le ponemos el nombre que viene en el arreglo a nuestro formData
      formData[el.name] = el.value;
  }

  console.log(formData);

  fetch(url + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json()) // Extraemos la respuesta
    .then(({ msg, token }) => {
      // si hay mensaje hay error
      if (msg) {
        return console.error(msg);
      }

      // si no hay error guardamos en el localstorage
      localStorage.setItem("token", token);
      // reidirige al chat cuando se conecta
      window.location = 'chat.html'
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(googleUser) {
  //Google Token : ID_TOKEN
  //console.log('id_token', response.credential);

  const data = { id_token: googleUser.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json()) // Aca abrimos el readable string para ver la data que viene en la respuesta
    .then(({ token }) => {
      localStorage.setItem("token", token); // Guardamos el token en el loalstorage
      // redirige alchata cuando se conecta
      window.location = 'chat.html'
    })
    .catch(console.warn); // Por si algo sale mal, que avise!
}

button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.removeItem("token"), done => {
    console.log('Sesion terminada');
    location.reload();
  });
};
