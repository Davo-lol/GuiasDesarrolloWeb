// Inicializando primer color de fondo en el input color
const primerColorFondo = function (event) {
  document.body.style.backgroundColor = event.target.value;
};

const cambiarColorFondo = function (color) {
  document.body.style.backgroundColor = color;
};

//Funciones para modificar el color de los titulos
const primerColorTitulos = function (event) {
  let colorSeleccionado = event.target.value;
  const titulos = document.querySelectorAll("h1");
  for (let index = 0; index < titulos.length; index++) {
    titulos[index].style.color = colorSeleccionado;
  }
};

const cambiarColorTitulos = function (colorSeleccionado) {
  const titulos = document.querySelectorAll("h1");
  for (let index = 0; index < titulos.length; index++) {
    titulos[index].style.color = colorSeleccionado;
  }
};

//Funciones para modificar el color de los parrafos
const primerColorParrafos = function (event) {
  let colorSeleccionado = event.target.value;
  const parrafos = document.querySelectorAll("p");
  for (let index = 0; index < parrafos.length; index++) {
    parrafos[index].style.color = colorSeleccionado;
  }
};

const cambiarColorParrafos = function (colorSeleccionado) {
  const parrafos = document.querySelectorAll("p");
  for (let index = 0; index < parrafos.length; index++) {
    parrafos[index].style.color = colorSeleccionado;
  }
};

/*
En la guia cada boton tenia su propio contador y asignaba el valor en em
directamente a los h1, eso reemplazaba el tamaño grande de Bootstrap (display-5)
y los titulos se hacian mas pequeños al presionar "Aumentar".
Aqui se usa un solo factor de escala que se multiplica por el tamaño
original de cada elemento, asi ambos botones trabajan sobre el mismo valor.
*/
let escalaLetra = 1;
const PASO_LETRA = 0.1;

const aplicarTamanoLetra = function () {
  const elementos = document.querySelectorAll("h1, p");
  for (let index = 0; index < elementos.length; index++) {
    const elemento = elementos[index];
    // Se guarda el tamaño original (en px) la primera vez
    if (!elemento.dataset.tamanoOriginal) {
      elemento.dataset.tamanoOriginal = parseFloat(
        getComputedStyle(elemento).fontSize
      );
    }
    elemento.style.fontSize = `${elemento.dataset.tamanoOriginal * escalaLetra}px`;
  }
};

const aumentarLetra = function () {
  if (escalaLetra < 2) {
    escalaLetra += PASO_LETRA;
    aplicarTamanoLetra();
  }
};

const disminuirLetra = function () {
  if (escalaLetra > 0.6) {
    escalaLetra -= PASO_LETRA;
    aplicarTamanoLetra();
  }
};

const startDOM = () => {
  // Obteniendo la referencia del boton cambiar fondo
  const buttonFondo = document.getElementById("idFondo");
  buttonFondo.value = "#ffffff";
  buttonFondo.addEventListener("input", primerColorFondo, false);
  buttonFondo.addEventListener("change", cambiarColorFondo, false);
  buttonFondo.select();

  // Obteniendo la referencia del boton cambiar color de titulos
  const buttonTitulos = document.getElementById("idTitulos");
  buttonTitulos.value = "#000000";
  buttonTitulos.addEventListener("input", primerColorTitulos, false);
  buttonTitulos.addEventListener("change", cambiarColorTitulos, false);
  buttonTitulos.select();

  // Obteniendo la referencia del boton cambiar color de parrafos
  const buttonParrafos = document.getElementById("idParrafos");
  buttonParrafos.value = "#000000";
  buttonParrafos.addEventListener("input", primerColorParrafos, false);
  buttonParrafos.addEventListener("change", cambiarColorParrafos, false);
  buttonParrafos.select();

  //Obteniendo las referencias de los botonos
  const buttonAumentar = document.getElementById("idBtnAumentar");
  const buttonDisminuir = document.getElementById("idBtnDisminuir");

  buttonAumentar.addEventListener("click", aumentarLetra, false);
  buttonDisminuir.addEventListener("click", disminuirLetra, false);
};

// La guia define startDOM pero no muestra donde se llama,
// se ejecuta cuando la pagina termina de cargar
window.addEventListener("load", startDOM);
