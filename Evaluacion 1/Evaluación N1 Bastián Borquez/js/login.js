const cuentas = [
  { correo: "admin@semicel.cl",   clave: "admin123",   rol: "admin" },
  { correo: "cliente@semicel.cl", clave: "cliente123", rol: "cliente" },
  { correo: "maria@correo.cl",    clave: "maria123",   rol: "cliente" }
];


const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("correo");
const inputClave = document.getElementById("clave");
const errorLogin = document.getElementById("errorLogin");


function marcarError(campo, idError, mensaje) {
  campo.classList.add("is-invalid");
  document.getElementById(idError).textContent = mensaje;
}

// Quita el rojo de un campo
function limpiarError(campo) {
  campo.classList.remove("is-invalid");
}


formLogin.addEventListener("submit", function (evento) {

  // Evita que la página se recargue
  evento.preventDefault();

  // Oculta el mensaje general por si quedó de un intento anterior
  errorLogin.classList.add("d-none");

  const correo = inputCorreo.value.trim().toLowerCase();
  const clave = inputClave.value;

  let todoBien = true;

  if (correo === "") {
    marcarError(inputCorreo, "errorCorreo", "Ingresa tu correo.");
    todoBien = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    marcarError(inputCorreo, "errorCorreo", "Ingresa un correo válido, por ejemplo nombre@correo.cl.");
    todoBien = false;
  } else {
    limpiarError(inputCorreo);
  }

  // Validar contraseña
  if (clave === "") {
    marcarError(inputClave, "errorClave", "Ingresa tu contraseña.");
    todoBien = false;
  } else if (clave.length < 6) {
    marcarError(inputClave, "errorClave", "La contraseña tiene al menos 6 caracteres.");
    todoBien = false;
  } else {
    limpiarError(inputClave);
  }

  if (!todoBien) {
    return;
  }

  const cuenta = cuentas.find(function (c) {
    return c.correo === correo && c.clave === clave;
  });

  if (!cuenta) {
    errorLogin.textContent = "Correo o contraseña incorrectos.";
    errorLogin.classList.remove("d-none");
    return;
  }

  if (cuenta.rol === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
});
