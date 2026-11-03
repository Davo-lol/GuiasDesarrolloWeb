//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

//Contenedor de la tabla de pacientes
const tablaPacientes = document.getElementById("idTablaPacientes");

/*
EJERCICIO COMPLEMENTARIO 2: Persistencia con LocalStorage
Las claves donde se guardan los pacientes y los paises agregados
desde el modal, para que no se pierdan al recargar la pagina
*/
const KEY_PACIENTES = "guia6_pacientes";
const KEY_PAISES = "guia6_paises";

//Lee un arreglo guardado en LocalStorage, si no existe devuelve uno vacio
const leerStorage = (clave) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch (error) {
    return [];
  }
};

//Guarda un arreglo en LocalStorage convertido a texto JSON
const guardarStorage = (clave, arreglo) => {
  localStorage.setItem(clave, JSON.stringify(arreglo));
};

//Arreglo global de pacientes (se carga desde LocalStorage)
let arrayPaciente = leerStorage(KEY_PACIENTES);

//Arreglo de los paises que el usuario ha agregado con el modal
let arrayPaisesNuevos = leerStorage(KEY_PAISES);

/*
EJERCICIO COMPLEMENTARIO 1: Editar y eliminar
Guarda la posicion del paciente que se esta editando,
-1 significa que se esta registrando un paciente nuevo
*/
let indiceEdicion = -1;

//Muestra la notificacion con el texto y el color indicado
const notificar = (texto, color = "success") => {
  notificacion.className = `toast text-bg-${color}`;
  mensaje.innerHTML = texto;
  toast.show();
};

/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  //Si se estaba editando un paciente, el boton vuelve a su estado original
  indiceEdicion = -1;
  buttonAgregarPaciente.innerHTML =
    '<i class="bi bi-person-plus-fill"></i> Guardar Datos';

  inputNombre.focus();
};

/*
Funcion para validar el ingreso del paciente
*/

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    let paciente = new Array(
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion
    );

    if (indiceEdicion >= 0) {
      //Reemplazando la informacion del paciente que se esta editando
      arrayPaciente[indiceEdicion] = paciente;
      notificar("Se han actualizado los datos del paciente");
    } else {
      //Agregando informacion al arreglo paciente
      arrayPaciente.push(paciente);
      notificar("Se ha registrado un nuevo paciente");
    }

    //Guardando los cambios en LocalStorage y actualizando la tabla
    guardarStorage(KEY_PACIENTES, arrayPaciente);
    imprimirPacientes();

    //Limpiando formulario
    limpiarForm();
  } else {
    notificar("Faltan campos por completar", "danger");
  }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, indice) => {
    $fila += `<tr>
              <td scope="row" class="text-center fw-bold">${contador}</td>
              <td>${element[0]}</td>
              <td>${element[1]}</td>
              <td>${element[2]}</td>
              <td>${element[3]}</td>
              <td>${element[4]}</td>
              <td>${element[5]}</td>
              <td class="text-center text-nowrap">
                <button id="idBtnEditar${contador}" type="button" class="btn btn-primary"
                  title="Editar" data-accion="editar" data-indice="${indice}">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger"
                  title="Eliminar" data-accion="eliminar" data-indice="${indice}">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  //Si no hay pacientes se muestra el texto original
  if (arrayPaciente.length == 0) {
    tablaPacientes.innerHTML = "Ninguno";
    return;
  }

  let $table = `<div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                  <tr>
                    <th scope="col" class="text-center" style="width:5%">#</th>
                    <th scope="col" class="text-center" style="width:15%">Nombre</th>
                    <th scope="col" class="text-center" style="width:15%">Apellido</th>
                    <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                    <th scope="col" class="text-center" style="width:10%">Sexo</th>
                    <th scope="col" class="text-center" style="width:10%">País</th>
                    <th scope="col" class="text-center" style="width:25%">Dirección</th>
                    <th scope="col" class="text-center" style="width:10%">Opciones</th>
                  </tr>
                  ${imprimirFilas()}
                </table>
              </div>
            `;
  tablaPacientes.innerHTML = $table;
};

//Carga en el formulario los datos del paciente seleccionado
const editarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];
  inputRdMasculino.checked = paciente[3] == "Hombre";
  inputRdFemenino.checked = paciente[3] == "Mujer";
  inputDireccion.value = paciente[5];

  //Buscando el option del select que tenga el nombre del pais guardado
  let opcion = Array.from(cmbPais.options).find(
    (option) => option.text == paciente[4]
  );
  cmbPais.value = opcion ? opcion.value : 0;

  //Se cambia el texto del boton para indicar que se esta editando
  indiceEdicion = indice;
  buttonAgregarPaciente.innerHTML =
    '<i class="bi bi-arrow-repeat"></i> Actualizar Datos';

  notificar(`Editando a ${paciente[0]} ${paciente[1]}`, "primary");
  inputNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

//Elimina el paciente seleccionado despues de confirmar
const eliminarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];

  if (confirm(`¿Desea eliminar al paciente ${paciente[0]} ${paciente[1]}?`)) {
    arrayPaciente.splice(indice, 1);
    guardarStorage(KEY_PACIENTES, arrayPaciente);

    //Si se elimina el paciente que se estaba editando se limpia el formulario
    if (indiceEdicion == indice) {
      limpiarForm();
    } else if (indiceEdicion > indice) {
      indiceEdicion--;
    }

    imprimirPacientes();
    notificar("Se ha eliminado el paciente", "danger");
  }
};

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;

//Crea un nuevo option en el select de paises
const crearOptionPais = (nombrePais) => {
  let option = document.createElement("option");
  option.textContent = nombrePais;
  option.value = contadorGlobalOption + 1;
  contadorGlobalOption++;
  cmbPais.appendChild(option);
};

const addPais = () => {
  let paisNew = inputNombrePais.value.trim();

  if (paisNew != "") {
    // Creando nuevo option con la API DOM
    // y agregandolo en el select
    crearOptionPais(paisNew);

    //Guardando el nuevo pais para que siga disponible al recargar
    arrayPaisesNuevos.push(paisNew);
    guardarStorage(KEY_PAISES, arrayPaisesNuevos);

    notificar("Pais agregado correctamente");
  } else {
    notificar("Faltan campos por completar", "danger");
  }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

// Los botones Editar y Eliminar se crean despues de cargar la pagina,
// por eso el evento click se agrega al contenedor de la tabla
// y se revisa cual boton fue presionado (delegacion de eventos)
tablaPacientes.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;

  const indice = parseInt(boton.dataset.indice);
  if (boton.dataset.accion == "editar") {
    editarPaciente(indice);
  } else {
    eliminarPaciente(indice);
  }
});

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
//Se agregan los paises guardados y se muestran los pacientes guardados
arrayPaisesNuevos.forEach((pais) => crearOptionPais(pais));
imprimirPacientes();
limpiarForm();
