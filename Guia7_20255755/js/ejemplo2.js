// Obteniendo la referencia de los elementos
// por medio de arreglos asociativos
// aqui se esta utilizando el atributo name de cada elemento
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];
const buttonRecorrer = document.forms["frmRegistro"].elements["btnRecorrer"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
// PARA IMPRIMIR EL RESULTADO
const bodyModal = document.getElementById("idBodyModal");
const tituloModal = document.getElementById("modalLabel");

// Recorrer el formulario
const recorrerFormulario = function () {
  let totText = 0;
  let totRadio = 0;
  let totCheck = 0;
  let totDate = 0;
  let totSelect = 0;
  let totFile = 0;
  let totPass = 0;
  let totEmail = 0;

  // Recorriendo elementos del formulario
  let elementos = formulario.elements;
  let totalElementos = elementos.length;

  for (let index = 0; index < totalElementos; index++) {
    // Accediendo a cada hijo del formulario
    let elemento = elementos[index];

    // verificando el tipo de control en el formulario
    let tipoElemento = elemento.type;
    // verificando el tipo de nodo
    let tipoNode = elemento.nodeName;

    // Contabilizando el total de INPUT TYPE = TEXT
    if (tipoElemento == "text" && tipoNode == "INPUT") {
      console.log(elemento);
      totText++;
    }
    // Contabilizando el total de INPUT TYPE = PASSWORD
    else if (tipoElemento == "password" && tipoNode == "INPUT") {
      console.log(elemento);
      totPass++;
    }
    // Contabilizando el total de INPUT TYPE = EMAIL
    else if (tipoElemento == "email" && tipoNode == "INPUT") {
      console.log(elemento);
      totEmail++;
    }
    // Contabilizando el total de INPUT TYPE = RADIO
    else if (tipoElemento == "radio" && tipoNode == "INPUT") {
      console.log(elemento);
      totRadio++;
    }
    // Contabilizando el total de INPUT TYPE = CHECKBOX
    else if (tipoElemento == "checkbox" && tipoNode == "INPUT") {
      console.log(elemento);
      totCheck++;
    }
    // Contabilizando el total de INPUT TYPE = FILE
    else if (tipoElemento == "file" && tipoNode == "INPUT") {
      console.log(elemento);
      totFile++;
    }
    // Contabilizando el total de INPUT TYPE = DATE
    else if (tipoElemento == "date" && tipoNode == "INPUT") {
      console.log(elemento);
      totDate++;
    }
    // Contabilizando el total de SELECT
    else if (tipoNode == "SELECT") {
      console.log(elemento);
      totSelect++;
    }
  }

  let resultado = `
    Total de input[type="text"] = ${totText}<br>
    Total de input[type="password"] = ${totPass}<br>
    Total de input[type="radio"] = ${totRadio}<br>
    Total de input[type="checkbox"] = ${totCheck}<br>
    Total de input[type="date"] = ${totDate}<br>
    Total de input[type="email"] = ${totEmail}<br>
    Total de select = ${totSelect}<br>
  `;

  tituloModal.textContent = "Agregando un nuevo control";
  bodyModal.innerHTML = resultado;
  //Funcion que permite mostrar el modal de Bootstrap
  //Esta funcion es definida por Bootstrap
  modal.show();
};

/*
EJERCICIO COMPLEMENTARIO 1: Validacion del formulario
Los datos validados se muestran en el modal con una tabla
creada solo con funciones del DOM (sin innerHTML)
*/

// Referencias a los controles del formulario
const inputNombre = document.getElementById("idNombre");
const inputApellidos = document.getElementById("idApellidos");
const inputFechaNac = document.getElementById("idFechaNac");
const inputCorreo = document.getElementById("idCorreo");
const inputPassword = document.getElementById("idPassword");
const inputPasswordRepetir = document.getElementById("idPasswordRepetir");
const cmbPais = document.getElementById("idCmPais");
const inputArchivo = document.getElementById("idArchivo");
const checkIntereses = formulario.querySelectorAll("input[type='checkbox']");
const radioCarreras = formulario.querySelectorAll("input[name='idRdCarrera']");
const errorIntereses = document.getElementById("idErrorIntereses");
const errorCarrera = document.getElementById("idErrorCarrera");

// Expresion regular para el correo: usuario@dominio.ext
const expresionCorreo = /^[\w.+-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/;

// Devuelve el texto del label asociado a un control
const textoLabel = (control) =>
  formulario.querySelector(`label[for='${control.id}']`).textContent.trim();

// Marca un control en rojo y crea (o actualiza) su mensaje de error
const mostrarError = (control, mensaje) => {
  control.classList.add("is-invalid");
  let feedback = control.nextElementSibling;
  if (!feedback || !feedback.classList.contains("invalid-feedback")) {
    feedback = document.createElement("div");
    feedback.setAttribute("class", "invalid-feedback");
    control.insertAdjacentElement("afterend", feedback);
  }
  feedback.textContent = mensaje;
};

// Quita el estilo de error de un control
const quitarError = (control) => {
  control.classList.remove("is-invalid");
};

// Muestra u oculta el mensaje de un grupo de checkbox o radio
const errorGrupo = (divError, hayError) => {
  divError.classList.toggle("d-none", !hayError);
};

// Devuelve la fecha actual con el formato yyyy-mm-dd del input date
const fechaActual = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

const validarFormulario = function () {
  let valido = true;

  // a. Validando que los campos no esten vacios
  const camposTexto = [
    inputNombre,
    inputApellidos,
    inputFechaNac,
    inputCorreo,
    inputPassword,
    inputPasswordRepetir,
  ];
  for (const campo of camposTexto) {
    if (campo.value.trim() == "") {
      mostrarError(campo, `El campo ${textoLabel(campo)} es obligatorio.`);
      valido = false;
    } else {
      quitarError(campo);
    }
  }

  // b. Validando que la fecha de nacimiento no supere la fecha actual
  if (inputFechaNac.value != "" && inputFechaNac.value > fechaActual()) {
    mostrarError(inputFechaNac, "La fecha de nacimiento no puede ser futura.");
    valido = false;
  }

  // c. Validando el correo con una expresion regular
  if (inputCorreo.value != "" && !expresionCorreo.test(inputCorreo.value.trim())) {
    mostrarError(inputCorreo, "Ingrese un correo válido. Ejemplo: usuario@correo.com");
    valido = false;
  }

  // d. Validando que las contraseñas sean iguales
  if (
    inputPasswordRepetir.value != "" &&
    inputPassword.value != inputPasswordRepetir.value
  ) {
    mostrarError(inputPasswordRepetir, "Las contraseñas no coinciden.");
    valido = false;
  }

  // e. Verificando que este seleccionado al menos un interes
  const intereses = Array.from(checkIntereses).filter((check) => check.checked);
  errorGrupo(errorIntereses, intereses.length == 0);
  if (intereses.length == 0) valido = false;

  // f. Verificando que se haya seleccionado una carrera
  const carrera = Array.from(radioCarreras).find((radio) => radio.checked);
  errorGrupo(errorCarrera, !carrera);
  if (!carrera) valido = false;

  // g. Verificando que se haya seleccionado un pais
  // (la primera opcion "Seleccione una opcion" tiene el indice 0)
  if (cmbPais.selectedIndex == 0) {
    mostrarError(cmbPais, "Seleccione su país de origen.");
    valido = false;
  } else {
    quitarError(cmbPais);
  }

  if (!valido) {
    // Se coloca el cursor en el primer campo con error
    const primerError = formulario.querySelector(".is-invalid");
    if (primerError) primerError.focus();
    return;
  }

  // Informacion que se mostrara en la tabla
  const datos = [
    ["Nombres", inputNombre.value.trim()],
    ["Apellidos", inputApellidos.value.trim()],
    ["Fecha de nacimiento", inputFechaNac.value],
    ["Correo electrónico", inputCorreo.value.trim()],
    ["Intereses", intereses.map((check) => textoLabel(check)).join(", ")],
    ["Carrera", textoLabel(carrera)],
    ["País de origen", cmbPais.options[cmbPais.selectedIndex].text],
    [
      "Avatar",
      inputArchivo.files.length > 0 ? inputArchivo.files[0].name : "Sin imagen",
    ],
  ];

  mostrarTabla(datos);
};

// Crea la tabla con createElement, createTextNode y appendChild
const mostrarTabla = function (datos) {
  // Eliminando el contenido anterior del modal con removeChild
  while (bodyModal.hasChildNodes()) {
    bodyModal.removeChild(bodyModal.firstChild);
  }

  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered mb-0");

  // Encabezado de la tabla
  const thead = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  for (const titulo of ["Campo", "Información"]) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.appendChild(document.createTextNode(titulo));
    filaEncabezado.appendChild(th);
  }
  thead.appendChild(filaEncabezado);
  tabla.appendChild(thead);

  // Cuerpo de la tabla, una fila por cada dato
  const tbody = document.createElement("tbody");
  for (const [campo, valor] of datos) {
    const fila = document.createElement("tr");

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(campo));

    const td = document.createElement("td");
    td.appendChild(document.createTextNode(valor));

    fila.appendChild(th);
    fila.appendChild(td);
    tbody.appendChild(fila);
  }
  tabla.appendChild(tbody);

  bodyModal.appendChild(tabla);
  tituloModal.textContent = "Información registrada";
  modal.show();
};

// Al corregir un campo se quita el mensaje de error
formulario.addEventListener("input", (e) => quitarError(e.target));
formulario.addEventListener("change", (e) => {
  quitarError(e.target);
  if (e.target.type == "checkbox") errorGrupo(errorIntereses, false);
  if (e.target.type == "radio") errorGrupo(errorCarrera, false);
});

// No se permite elegir una fecha posterior a la actual en el calendario
inputFechaNac.setAttribute("max", fechaActual());

// agregando eventos a los botones
button.onclick = () => {
  validarFormulario();
};

buttonRecorrer.onclick = () => {
  recorrerFormulario();
};
