/*
EJERCICIO COMPLEMENTARIO 3: Validacion con expresiones regulares
Cada campo del formulario tiene su propia expresion regular
y se valida en tiempo real mientras el usuario escribe
*/

//Expresiones regulares de cada campo
const expresiones = {
  //Dos letras y tres numeros. Ejemplo: AB001
  carnet: /^[A-Z]{2}\d{3}$/,
  //Al menos dos palabras, solo letras (incluye tildes y ñ) separadas por un espacio
  nombre: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/,
  //Ocho digitos, un guion y un digito
  dui: /^\d{8}-\d$/,
  //####-######-###-#
  nit: /^\d{4}-\d{6}-\d{3}-\d$/,
  //dd/mm/aaaa con dia de 01 a 31 y mes de 01 a 12
  fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  //usuario@dominio.ext
  correo: /^[\w.+-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/,
  //Solo numeros (de uno a tres digitos)
  edad: /^\d{1,3}$/,
};

//Accediendo a los elementos html
const formFicha = document.getElementById("idFormFicha");
const campos = formFicha.querySelectorAll("[data-campo]");
const buttonValidar = document.getElementById("idBtnValidar");
const buttonLimpiar = document.getElementById("idBtnLimpiarFicha");
const tablaEstudiantes = document.getElementById("idTablaEstudiantes");

// Componente de Bootstrap
const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Arreglo de estudiantes que pasaron la validacion
let arrayEstudiantes = [];

//Muestra la notificacion con el texto y el color indicado
const notificar = (texto, color = "success") => {
  notificacion.className = `toast text-bg-${color}`;
  mensaje.innerHTML = texto;
  toast.show();
};

//La expresion regular solo revisa el formato dd/mm/aaaa,
//esta funcion revisa que la fecha exista (no 31/02) y que no sea futura
const esFechaReal = (texto) => {
  const [dia, mes, anio] = texto.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() == anio &&
    fecha.getMonth() == mes - 1 &&
    fecha.getDate() == dia &&
    fecha <= new Date()
  );
};

//Valida un campo con su expresion regular y le asigna el estilo de Bootstrap
const validarCampo = (input) => {
  const tipo = input.dataset.campo;
  let valor = input.value.trim();

  //El carnet se guarda en mayusculas
  if (tipo == "carnet") {
    valor = valor.toUpperCase();
    input.value = valor;
  }

  let valido = expresiones[tipo].test(valor);
  if (valido && tipo == "fecha") {
    valido = esFechaReal(valor);
  }

  input.classList.toggle("is-valid", valido);
  input.classList.toggle("is-invalid", !valido);
  return valido;
};

//Validando cada campo en tiempo real con el evento input
campos.forEach((input) => {
  input.addEventListener("input", () => validarCampo(input));
});

//La edad solo permite escribir numeros (igual que en el ejemplo de recursividad)
document.getElementById("idTxtEdad").addEventListener("keypress", (e) => {
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
});

const limpiarFicha = () => {
  campos.forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid", "is-invalid");
  });
  campos[0].focus();
};

const imprimirEstudiantes = () => {
  let filas = "";
  arrayEstudiantes.forEach((estudiante, i) => {
    filas += `<tr>
                <td class="text-center fw-bold">${i + 1}</td>
                <td>${estudiante.carnet}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.dui}</td>
                <td>${estudiante.nit}</td>
                <td>${estudiante.fecha}</td>
                <td>${estudiante.correo}</td>
                <td class="text-center">${estudiante.edad}</td>
              </tr>`;
  });

  tablaEstudiantes.innerHTML = `<div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Carnet</th>
          <th class="text-center">Nombre completo</th>
          <th class="text-center">DUI</th>
          <th class="text-center">NIT</th>
          <th class="text-center">Fecha nacimiento</th>
          <th class="text-center">Correo</th>
          <th class="text-center">Edad</th>
        </tr>
        ${filas}
      </table>
    </div>`;
};

const guardarFicha = () => {
  //Se validan todos los campos para marcar en rojo los que esten mal
  let errores = 0;
  campos.forEach((input) => {
    if (!validarCampo(input)) errores++;
  });

  if (errores > 0) {
    notificar(
      `Hay ${errores} campo${errores > 1 ? "s" : ""} con formato incorrecto`,
      "danger"
    );
    formFicha.querySelector(".is-invalid").focus();
    return;
  }

  //Creando un objeto con la informacion del estudiante
  let estudiante = {};
  campos.forEach((input) => {
    estudiante[input.dataset.campo] = input.value.trim();
  });
  arrayEstudiantes.push(estudiante);

  imprimirEstudiantes();
  notificar("La ficha del estudiante es válida y se ha guardado");
  limpiarFicha();
};

buttonValidar.onclick = () => {
  guardarFicha();
};

buttonLimpiar.onclick = () => {
  limpiarFicha();
};
