const tablaProductos = document.getElementById("tablaProductos");


function mostrarTabla() {

  tablaProductos.innerHTML = "";

  if (productos.length === 0) {
    tablaProductos.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-muted">
          No hay productos. Agrega uno con el formulario.
        </td>
      </tr>
    `;
    return;
  }

  productos.forEach(function (producto) {
    tablaProductos.innerHTML += `
      <tr>
        <td><img src="${producto.imagenes[0]}" class="miniatura"
                 alt="${producto.marca} ${producto.modelo}"></td>
        <td>${producto.marca}</td>
        <td>${producto.modelo}</td>
        <td>${producto.pantalla}</td>
        <td>${producto.procesador}</td>
        <td>${producto.camara}</td>
        <td>${producto.memoria}</td>
        <td>${producto.ram}</td>
        <td>$${producto.precio.toLocaleString("es-CL")}</td>
        <td class="text-nowrap">
          <button class="btn btn-outline-secondary btn-sm boton-editar"
                  data-id="${producto.id}">Editar</button>
          <button class="btn btn-outline-danger btn-sm boton-eliminar"
                  data-id="${producto.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });
}


mostrarTabla();

const mensajeAdmin = document.getElementById("mensajeAdmin");

// Muestra un aviso de color durante 3 segundos
function mostrarMensaje(texto, tipo) {
  mensajeAdmin.className = "alert alert-" + tipo;
  mensajeAdmin.textContent = texto;

  setTimeout(function () {
    mensajeAdmin.classList.add("d-none");
  }, 3000);
}



const formProducto = document.getElementById("formProducto");

function marcarError(idCampo, mensaje) {
  document.getElementById(idCampo).classList.remove("is-valid");
  document.getElementById(idCampo).classList.add("is-invalid");
  document.getElementById(idCampo + "Error").textContent = mensaje;
}

function marcarCorrecto(idCampo) {
  document.getElementById(idCampo).classList.remove("is-invalid");
  document.getElementById(idCampo).classList.add("is-valid");
}

// Revisa que un campo no esté vacío. Devuelve true si está bien
function validarCampo(idCampo, mensaje) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") {
    marcarError(idCampo, mensaje);
    return false;
  }
  marcarCorrecto(idCampo);
  return true;
}

formProducto.addEventListener("submit", function (evento) {

  evento.preventDefault();

  let todoBien = true;

  // Campos que solo no pueden quedar vacíos
  if (!validarCampo("marca", "Elige una marca.")) todoBien = false;
  if (!validarCampo("modelo", "Ingresa el modelo.")) todoBien = false;
  if (!validarCampo("pantalla", "Ingresa la pantalla.")) todoBien = false;
  if (!validarCampo("procesador", "Ingresa el procesador.")) todoBien = false;
  if (!validarCampo("camara", "Ingresa la cámara.")) todoBien = false;
  if (!validarCampo("memoria", "Ingresa la memoria.")) todoBien = false;
  if (!validarCampo("ram", "Ingresa la RAM.")) todoBien = false;

  // Precio
  const precio = Number(document.getElementById("precio").value);
  if (precio <= 0) {
    marcarError("precio", "Ingresa un precio mayor que 0.");
    todoBien = false;
  } else {
    marcarCorrecto("precio");
  }

  // Imagen
  const imagen = document.getElementById("imagen").value.trim();
  if (!/\.(jpg|jpeg|png|webp)$/i.test(imagen)) {
    marcarError("imagen", "Ingresa una ruta que termine en .jpg, .png o .webp.");
    todoBien = false;
  } else {
    marcarCorrecto("imagen");
  }

  if (!todoBien) {
    return;
  }

  // Id nuevo
  let nuevoId = 1;
  productos.forEach(function (p) {
    if (p.id >= nuevoId) {
      nuevoId = p.id + 1;
    }
  });

  const nuevo = {
    id: nuevoId,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value.trim(),
    pantalla: document.getElementById("pantalla").value.trim(),
    procesador: document.getElementById("procesador").value.trim(),
    camara: document.getElementById("camara").value.trim(),
    memoria: document.getElementById("memoria").value.trim(),
    ram: document.getElementById("ram").value.trim(),
    precio: precio,
    imagenes: [imagen]
  };

  productos.push(nuevo);
  mostrarTabla();
  mostrarMensaje(nuevo.marca + " " + nuevo.modelo + " fue agregado con éxito.", "success");

  // Limpieza de formulario
  formProducto.reset();
  formProducto.querySelectorAll(".is-valid").forEach(function (campo) {
    campo.classList.remove("is-valid");
  });
});



tablaProductos.addEventListener("click", function (evento) {

  if (evento.target.classList.contains("boton-eliminar")) {

    const id = Number(evento.target.dataset.id);
    const producto = productos.find(function (p) {
      return p.id === id;
    });

    // Pedimos confirmación antes de borrar
    const seguro = confirm("¿Eliminar " + producto.marca + " " + producto.modelo + "?");
    if (!seguro) {
      return;
    }

    productos = productos.filter(function (p) {
      return p.id !== id;
    });

    mostrarTabla();
    mostrarMensaje(producto.marca + " " + producto.modelo + " fue eliminado con éxito.", "success");
  }
});

