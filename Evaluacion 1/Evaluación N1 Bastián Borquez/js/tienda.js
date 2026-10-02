const listaProductos = document.getElementById("listaProductos");


function mostrarProductos(lista) {

  listaProductos.innerHTML = "";

  lista.forEach(function (producto) {

    listaProductos.innerHTML += `
      <div class="col-6 col-lg-4">
        <div class="card tarjeta-producto">
          <img src="${producto.imagenes[0]}" class="card-img-top"
               alt="${producto.marca} ${producto.modelo}">
          <div class="card-body text-center">
            <p class="precio mb-2">$${producto.precio.toLocaleString("es-CL")}</p>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-secondary btn-sm boton-detalle"
                      data-id="${producto.id}">Ver detalle</button>
              <button class="btn btn-semicel btn-sm boton-agregar"
                      data-id="${producto.id}">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

mostrarProductos(productos);



const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle"));
const tituloDetalle = document.getElementById("tituloDetalle");
const imagenesDetalle = document.getElementById("imagenesDetalle");
const caracteristicasDetalle = document.getElementById("caracteristicasDetalle");
const precioDetalle = document.getElementById("precioDetalle");
const botonAgregarCarrito = document.getElementById("botonAgregarCarrito");


function mostrarDetalle(id) {

  const producto = productos.find(function (p) {
    return p.id === id;
  });


  tituloDetalle.textContent = producto.marca + " " + producto.modelo;

  
  imagenesDetalle.innerHTML = "";
  producto.imagenes.forEach(function (ruta, posicion) {

    let activa = "";
    if (posicion === 0) {
      activa = "active";
    }

    imagenesDetalle.innerHTML += `
      <div class="carousel-item ${activa}">
        <img src="${ruta}" class="d-block w-100"
             alt="${producto.modelo}, foto ${posicion + 1}">
      </div>
    `;
  });


  caracteristicasDetalle.innerHTML = `
    <li><strong>Pantalla:</strong> ${producto.pantalla}</li>
    <li><strong>Procesador:</strong> ${producto.procesador}</li>
    <li><strong>Cámara:</strong> ${producto.camara}</li>
    <li><strong>Memoria:</strong> ${producto.memoria}</li>
    <li><strong>RAM:</strong> ${producto.ram}</li>
  `;

  
  precioDetalle.textContent = "$" + producto.precio.toLocaleString("es-CL");

  // id en el botón del carrito del modal
  botonAgregarCarrito.dataset.id = producto.id;

 
  modalDetalle.show();
}





let carrito = [];


const contadorCarrito = document.getElementById("contadorCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const botonFinalizar = document.getElementById("botonFinalizar");



function agregarAlCarrito(id) {

  // Cada equipo seminuevo es una sola unidad: no se puede agregar dos veces
  const yaEsta = carrito.find(function (p) {
    return p.id === id;
  });

  if (yaEsta) {
    alert("Este celular ya está en tu carrito.");
    return;   
  }

  const producto = productos.find(function (p) {
    return p.id === id;
  });

  carrito.push(producto);   // push agrega al final del arreglo
  mostrarCarrito();
}


function quitarDelCarrito(id) {

  // se dejan los elementos que no coinciden
  carrito = carrito.filter(function (p) {
    return p.id !== id;
  });

  mostrarCarrito();
}


function mostrarCarrito() {

  contadorCarrito.textContent = carrito.length;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
    totalCarrito.textContent = "0";
    return;
  }

  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(function (producto) {

    total = total + producto.precio;

    listaCarrito.innerHTML += `
      <div class="d-flex align-items-center gap-2 mb-3">
        <img src="${producto.imagenes[0]}" class="miniatura"
             alt="${producto.marca} ${producto.modelo}">
        <div class="flex-grow-1">
          <p class="m-0 small fw-bold">${producto.marca} ${producto.modelo}</p>
          <p class="m-0 small">$${producto.precio.toLocaleString("es-CL")}</p>
        </div>
        <button class="btn btn-outline-danger btn-sm boton-quitar"
                data-id="${producto.id}">Quitar</button>
      </div>
    `;
  });

  totalCarrito.textContent = total.toLocaleString("es-CL");
}


mostrarCarrito();




// Clics ver detalle o agregar al carrito
listaProductos.addEventListener("click", function (evento) {

  const id = Number(evento.target.dataset.id);

  if (evento.target.classList.contains("boton-detalle")) {
    mostrarDetalle(id);
  } else if (evento.target.classList.contains("boton-agregar")) {
    agregarAlCarrito(id);
  }
});


// Clic en "Agregar al carrito" dentro del modal
botonAgregarCarrito.addEventListener("click", function () {
  agregarAlCarrito(Number(botonAgregarCarrito.dataset.id));
  modalDetalle.hide();
});


// Clics botón "Quitar"
listaCarrito.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("boton-quitar")) {
    quitarDelCarrito(Number(evento.target.dataset.id));
  }
});

// abrir modal de compra
const panelCarrito = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("carrito"));
const modalCompra = new bootstrap.Modal(document.getElementById("modalCompra"));
const totalCompra = document.getElementById("totalCompra");

botonFinalizar.addEventListener("click", function () {

  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega un celular para comprar.");
    return;
  }

  totalCompra.textContent = totalCarrito.textContent;
  panelCarrito.hide();
  modalCompra.show();
});




const formCompra = document.getElementById("formCompra");

// Marca un campo en rojo y escribe el mensaje de error debajo
function marcarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const error = document.getElementById(idCampo + "Error");
  campo.classList.remove("is-valid");
  campo.classList.add("is-invalid");
  error.textContent = mensaje;
}

// Marca un campo en verde
function marcarCorrecto(idCampo) {
  const campo = document.getElementById(idCampo);
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");
}

formCompra.addEventListener("submit", function (evento) {

  // Evita que la página se recargue
  evento.preventDefault();

  // Lee los campos 
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const pago = document.getElementById("pago").value;

  let todoBien = true;

  if (nombre.length < 3) {
    marcarError("nombre", "Ingresa tu nombre completo.");
    todoBien = false;
  } else {
    marcarCorrecto("nombre");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    marcarError("correo", "Ingresa un correo válido, por ejemplo nombre@correo.cl.");
    todoBien = false;
  } else {
    marcarCorrecto("correo");
  }

  if (!/^9\d{8}$/.test(telefono)) {
    marcarError("telefono", "Ingresa un celular de 9 dígitos que empiece con 9.");
    todoBien = false;
  } else {
    marcarCorrecto("telefono");
  }

  if (direccion.length < 5) {
    marcarError("direccion", "Ingresa una dirección de despacho.");
    todoBien = false;
  } else {
    marcarCorrecto("direccion");
  }

  if (pago === "") {
    marcarError("pago", "Elige un método de pago.");
    todoBien = false;
  } else {
    marcarCorrecto("pago");
  }

  // Si algún campo falla
  if (!todoBien) {
    return;
  }

  // Compra confirmada
  modalCompra.hide();
  alert("¡Gracias por tu compra, " + nombre + "! Te enviaremos la confirmación a " + correo + ".");

  carrito = [];
  mostrarCarrito();

  // Dejamos el formulario limpio para la próxima compra
  formCompra.reset();
  formCompra.querySelectorAll(".is-valid").forEach(function (campo) {
    campo.classList.remove("is-valid");
  });
});



const filtroMarca = document.getElementById("filtroMarca");
const ordenPrecio = document.getElementById("ordenPrecio");


// Aplica la marca y el orden elegidos, y vuelve a dibujar el catálogo
function aplicarFiltros() {

  const marcaElegida = filtroMarca.value;
  const ordenElegido = ordenPrecio.value;

  let resultado = productos.filter(function (p) {
    return marcaElegida === "" || p.marca === marcaElegida;
  });

  if (ordenElegido === "menor") {
    resultado.sort(function (a, b) {
      return a.precio - b.precio;
    });
  } else if (ordenElegido === "mayor") {
    resultado.sort(function (a, b) {
      return b.precio - a.precio;
    });
  }

  if (resultado.length === 0) {
    listaProductos.innerHTML = `<p class="text-muted">No hay celulares de esa marca por ahora.</p>`;
  } else {
    mostrarProductos(resultado);
  }
}


//Cada vez que cambia un select, se vuelven a aplicar los filtros
filtroMarca.addEventListener("change", aplicarFiltros);
ordenPrecio.addEventListener("change", aplicarFiltros);



