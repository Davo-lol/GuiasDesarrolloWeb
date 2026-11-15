/*
EJERCICIO COMPLEMENTARIO 2: Consumo de una API de RapidAPI
API: Free-to-Play Games Database (plan Basic gratuito)
  - Listado de recursos: GET /api/games?platform=&sort-by=
  - Detalle de un recurso: GET /api/game?id=
*/

const API_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_URL = `https://${API_HOST}/api`;
const KEY_CLAVE = "guia7_rapidapi_key";
const JUEGOS_POR_PAGINA = 24;

// Referencias a los elementos HTML
const panelClave = document.getElementById("idPanelClave");
const formClave = document.getElementById("idFormClave");
const inputClave = document.getElementById("idTxtClave");
const buttonCambiarClave = document.getElementById("idBtnCambiarClave");

const contenido = document.getElementById("idContenido");
const formFiltros = document.getElementById("idFormFiltros");
const cmbPlataforma = document.getElementById("idCmbPlataforma");
const cmbOrden = document.getElementById("idCmbOrden");
const inputBuscar = document.getElementById("idTxtBuscar");
const resumen = document.getElementById("idResumen");
const cargando = document.getElementById("idCargando");
const cajaError = document.getElementById("idError");
const listado = document.getElementById("idListado");
const buttonMas = document.getElementById("idBtnMas");

const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const tituloDetalle = document.getElementById("idTituloDetalle");
const bodyDetalle = document.getElementById("idBodyDetalle");
const linkJugar = document.getElementById("idLinkJugar");

// Estado de la aplicacion
let juegos = []; // listado completo que devuelve la API
let juegosFiltrados = []; // listado despues de aplicar la busqueda
let mostrados = 0; // cantidad de tarjetas dibujadas
let controladorListado = null; // permite cancelar una consulta anterior
const cacheDetalle = new Map(); // detalles ya consultados (id -> juego)

/* ==================== Clave de RapidAPI ==================== */

const leerClave = () => {
  try {
    return localStorage.getItem(KEY_CLAVE) || "";
  } catch (error) {
    return "";
  }
};

const guardarClave = (clave) => {
  try {
    localStorage.setItem(KEY_CLAVE, clave);
  } catch (error) {
    // Si el navegador bloquea LocalStorage la clave solo dura esta sesion
  }
};

let claveApi = leerClave();

const mostrarPanelClave = () => {
  panelClave.classList.remove("d-none");
  contenido.classList.add("d-none");
  buttonCambiarClave.classList.add("d-none");
  inputClave.value = "";
  inputClave.focus();
};

const mostrarContenido = () => {
  panelClave.classList.add("d-none");
  contenido.classList.remove("d-none");
  buttonCambiarClave.classList.remove("d-none");
};

/* ==================== Peticiones a la API ==================== */

// Error con un mensaje pensado para el usuario
class ErrorApi extends Error {
  constructor(mensaje, claveInvalida = false) {
    super(mensaje);
    this.claveInvalida = claveInvalida;
  }
}

// Realiza la peticion con los encabezados de RapidAPI y revisa la respuesta
const consultarApi = async (ruta, parametros = {}, signal) => {
  const url = new URL(`${API_URL}/${ruta}`);
  for (const [nombre, valor] of Object.entries(parametros)) {
    url.searchParams.set(nombre, valor);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": claveApi,
        "x-rapidapi-host": API_HOST,
      },
      signal,
    });
  } catch (error) {
    if (error.name == "AbortError") throw error;
    throw new ErrorApi(
      "No se pudo conectar con la API. Revise su conexión a internet e intente de nuevo."
    );
  }

  if (respuesta.status == 401 || respuesta.status == 403) {
    throw new ErrorApi(
      "La clave no es válida o su cuenta no está suscrita al plan Basic de Free-to-Play Games Database.",
      true
    );
  }
  if (respuesta.status == 429) {
    throw new ErrorApi(
      "Se alcanzó el límite de consultas del plan gratuito. Espere un momento e intente de nuevo."
    );
  }
  if (!respuesta.ok) {
    throw new ErrorApi(
      `La API respondió con un error (${respuesta.status}). Intente más tarde.`
    );
  }

  const datos = await respuesta.json();

  // Cuando no hay resultados la API responde un objeto { status: 0, status_message }
  if (datos && datos.status === 0) {
    throw new ErrorApi("No se encontraron juegos con los filtros seleccionados.");
  }
  return datos;
};

/* ==================== Listado de juegos ==================== */

const mostrarError = (error) => {
  cajaError.textContent = error.message;
  cajaError.classList.remove("d-none");

  // Si la clave no sirve se agrega un boton para cambiarla
  if (error.claveInvalida) {
    const boton = document.createElement("button");
    boton.setAttribute("type", "button");
    boton.setAttribute("class", "btn btn-sm btn-outline-danger ms-2");
    boton.textContent = "Ingresar otra clave";
    boton.addEventListener("click", mostrarPanelClave);
    cajaError.appendChild(boton);
  }
};

const limpiarListado = () => {
  while (listado.hasChildNodes()) {
    listado.removeChild(listado.firstChild);
  }
  mostrados = 0;
};

// Crea un elemento con clase y texto opcionales
const crear = (etiqueta, clase = "", texto = "") => {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.setAttribute("class", clase);
  if (texto) elemento.textContent = texto;
  return elemento;
};

// Crea la tarjeta de un juego del listado
const crearTarjeta = (juego) => {
  const columna = crear("div", "col");
  const tarjeta = crear("div", "card h-100 tarjeta-juego");

  const imagen = crear("img", "card-img-top");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("alt", juego.title);
  imagen.setAttribute("loading", "lazy");

  const cuerpo = crear("div", "card-body d-flex flex-column");
  const etiquetas = crear("div", "mb-2");
  etiquetas.appendChild(crear("span", "badge text-bg-primary me-1", juego.genre));
  etiquetas.appendChild(crear("span", "badge text-bg-secondary", juego.platform));

  const titulo = crear("h2", "card-title h5", juego.title);
  const descripcion = crear("p", "card-text small text-body-secondary", juego.short_description);

  const boton = crear("button", "btn btn-outline-primary mt-auto");
  boton.setAttribute("type", "button");
  boton.dataset.id = juego.id;
  boton.appendChild(crear("i", "bi bi-info-circle me-1"));
  boton.appendChild(document.createTextNode("Ver detalle"));

  cuerpo.appendChild(etiquetas);
  cuerpo.appendChild(titulo);
  cuerpo.appendChild(descripcion);
  cuerpo.appendChild(boton);
  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);
  return columna;
};

// Dibuja la siguiente pagina de tarjetas
const mostrarMasJuegos = () => {
  const siguientes = juegosFiltrados.slice(mostrados, mostrados + JUEGOS_POR_PAGINA);
  for (const juego of siguientes) {
    listado.appendChild(crearTarjeta(juego));
  }
  mostrados += siguientes.length;
  buttonMas.classList.toggle("d-none", mostrados >= juegosFiltrados.length);
  resumen.textContent = `Mostrando ${mostrados} de ${juegosFiltrados.length} juegos.`;
};

// Aplica la busqueda por nombre sobre el listado ya descargado
const aplicarBusqueda = () => {
  const texto = inputBuscar.value.trim().toLowerCase();
  juegosFiltrados = juegos.filter((juego) =>
    juego.title.toLowerCase().includes(texto)
  );
  limpiarListado();

  if (juegosFiltrados.length == 0 && juegos.length > 0) {
    resumen.textContent = `Ningún juego coincide con "${inputBuscar.value.trim()}".`;
    buttonMas.classList.add("d-none");
    return;
  }
  mostrarMasJuegos();
};

const cargarJuegos = async () => {
  // Si hay una consulta en curso se cancela para no mezclar resultados
  if (controladorListado) controladorListado.abort();
  controladorListado = new AbortController();

  cajaError.classList.add("d-none");
  cargando.classList.remove("d-none");
  buttonMas.classList.add("d-none");
  resumen.textContent = "";
  limpiarListado();

  const parametros = { "sort-by": cmbOrden.value };
  if (cmbPlataforma.value != "all") parametros.platform = cmbPlataforma.value;

  try {
    juegos = await consultarApi("games", parametros, controladorListado.signal);
    aplicarBusqueda();
  } catch (error) {
    if (error.name == "AbortError") return;
    juegos = [];
    mostrarError(error);
  } finally {
    cargando.classList.add("d-none");
  }
};

/* ==================== Detalle de un juego ==================== */

// Fila "titulo: valor" para la ficha del juego
const crearDato = (titulo, valor) => {
  const fila = crear("div", "col-sm-6");
  fila.appendChild(crear("span", "fw-bold", `${titulo}: `));
  fila.appendChild(document.createTextNode(valor || "No disponible"));
  return fila;
};

const mostrarDetalle = (juego) => {
  while (bodyDetalle.hasChildNodes()) {
    bodyDetalle.removeChild(bodyDetalle.firstChild);
  }
  tituloDetalle.textContent = juego.title;
  linkJugar.setAttribute("href", juego.game_url);
  linkJugar.classList.remove("d-none");

  const fila = crear("div", "row g-4");

  // Columna izquierda: imagen y ficha tecnica
  const izquierda = crear("div", "col-lg-5");
  const imagen = crear("img", "img-fluid rounded mb-3");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("alt", juego.title);
  izquierda.appendChild(imagen);

  const ficha = crear("div", "row g-2 small");
  ficha.appendChild(crearDato("Género", juego.genre));
  ficha.appendChild(crearDato("Plataforma", juego.platform));
  ficha.appendChild(crearDato("Desarrollador", juego.developer));
  ficha.appendChild(crearDato("Distribuidor", juego.publisher));
  ficha.appendChild(crearDato("Lanzamiento", juego.release_date));
  ficha.appendChild(crearDato("Estado", juego.status));
  izquierda.appendChild(ficha);

  // Requisitos minimos (solo los juegos de PC los traen)
  const requisitos = juego.minimum_system_requirements;
  if (requisitos) {
    izquierda.appendChild(crear("h3", "h6 fw-bold mt-4", "Requisitos mínimos"));
    const lista = crear("ul", "small mb-0");
    const nombres = {
      os: "Sistema operativo",
      processor: "Procesador",
      memory: "Memoria",
      graphics: "Gráficos",
      storage: "Almacenamiento",
    };
    for (const [clave, nombre] of Object.entries(nombres)) {
      const item = crear("li");
      item.appendChild(crear("span", "fw-bold", `${nombre}: `));
      item.appendChild(document.createTextNode(requisitos[clave] || "No disponible"));
      lista.appendChild(item);
    }
    izquierda.appendChild(lista);
  }

  // Columna derecha: descripcion y capturas
  const derecha = crear("div", "col-lg-7");
  derecha.appendChild(crear("h3", "h6 fw-bold", "Descripción"));
  derecha.appendChild(crear("p", "descripcion-juego small", juego.description));

  if (juego.screenshots && juego.screenshots.length > 0) {
    derecha.appendChild(crear("h3", "h6 fw-bold mt-3", "Capturas"));
    const galeria = crear("div", "row g-2");
    for (const captura of juego.screenshots) {
      const columna = crear("div", "col-6");
      const img = crear("img", "captura");
      img.setAttribute("src", captura.image);
      img.setAttribute("alt", `Captura de ${juego.title}`);
      img.setAttribute("loading", "lazy");
      columna.appendChild(img);
      galeria.appendChild(columna);
    }
    derecha.appendChild(galeria);
  }

  fila.appendChild(izquierda);
  fila.appendChild(derecha);
  bodyDetalle.appendChild(fila);
};

const cargarDetalle = async (id) => {
  // Mensaje de carga dentro del modal mientras llega la respuesta
  while (bodyDetalle.hasChildNodes()) {
    bodyDetalle.removeChild(bodyDetalle.firstChild);
  }
  tituloDetalle.textContent = "Cargando detalle...";
  linkJugar.classList.add("d-none");
  const espera = crear("div", "text-center py-5");
  espera.appendChild(crear("div", "spinner-border text-primary"));
  bodyDetalle.appendChild(espera);
  modal.show();

  try {
    // Si el juego ya se consulto antes se usa la informacion guardada
    if (!cacheDetalle.has(id)) {
      cacheDetalle.set(id, await consultarApi("game", { id }));
    }
    mostrarDetalle(cacheDetalle.get(id));
  } catch (error) {
    tituloDetalle.textContent = "No se pudo cargar el detalle";
    while (bodyDetalle.hasChildNodes()) {
      bodyDetalle.removeChild(bodyDetalle.firstChild);
    }
    bodyDetalle.appendChild(crear("div", "alert alert-danger mb-0", error.message));
  }
};

/* ==================== Eventos ==================== */

formClave.addEventListener("submit", (e) => {
  e.preventDefault();
  const clave = inputClave.value.trim();
  if (clave == "") {
    inputClave.classList.add("is-invalid");
    return;
  }
  inputClave.classList.remove("is-invalid");
  claveApi = clave;
  guardarClave(clave);
  mostrarContenido();
  cargarJuegos();
});

buttonCambiarClave.addEventListener("click", mostrarPanelClave);

formFiltros.addEventListener("submit", (e) => {
  e.preventDefault();
  cargarJuegos();
});

// Cambiar un filtro vuelve a consultar la API
cmbPlataforma.addEventListener("change", cargarJuegos);
cmbOrden.addEventListener("change", cargarJuegos);

// La busqueda filtra el listado ya descargado, sin consultar la API
inputBuscar.addEventListener("input", aplicarBusqueda);

buttonMas.addEventListener("click", mostrarMasJuegos);

// Delegacion de eventos para los botones "Ver detalle" de las tarjetas
listado.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-id]");
  if (boton) cargarDetalle(Number(boton.dataset.id));
});

// Al iniciar se pide la clave o se carga el listado
if (claveApi) {
  mostrarContenido();
  cargarJuegos();
} else {
  mostrarPanelClave();
}
