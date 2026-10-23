// Arreglo que guarda los pedidos registrados mientras la página esté abierta
let pedidos = [];
// Precio máximo activo para el filtro (null = sin filtro)
let precioMaximoFiltro = null;

// Elementos del DOM
const inputProducto = document.querySelector("#inputProducto");
const inputPrecio = document.querySelector("#inputPrecio");
const inputCantidad = document.querySelector("#inputCantidad");
const inputPrecioMaximo = document.querySelector("#inputPrecioMaximo");
const btnAgregar = document.querySelector("#btnAgregar");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");
const mensajes = document.querySelector("#mensajes");
const cuerpoTabla = document.querySelector("#cuerpoTabla");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");

// ---------- Lógica (no modifica el DOM) ----------

function crearPedido(producto, precio, cantidad) {
    return { producto, precio, cantidad };
}

function obtenerErrores(producto, precio, cantidad) {
    const errores = [];
    if (producto === "") {
        errores.push("El nombre del producto no puede estar vacío.");
    }
    if (!(precio > 0)) {
        errores.push("El precio debe ser un número mayor que cero.");
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        errores.push("La cantidad debe ser un número entero positivo.");
    }
    return errores;
}

function calcularSubtotal(pedido) {
    return pedido.precio * pedido.cantidad;
}

// filter devuelve un arreglo nuevo, así que el arreglo original no se modifica
function filtrarPorPrecio(lista, precioMaximo) {
    if (precioMaximo === null) {
        return lista;
    }
    return lista.filter(pedido => pedido.precio <= precioMaximo);
}

function calcularTotalUnidades(lista) {
    return lista.reduce((total, pedido) => total + pedido.cantidad, 0);
}

function calcularMontoTotal(lista) {
    return lista.reduce((total, pedido) => total + calcularSubtotal(pedido), 0);
}

function formatearMoneda(valor) {
    return `$${valor.toFixed(2)}`;
}

// ---------- Actualización de la interfaz ----------

function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function crearFila(pedido) {
    const fila = document.createElement("tr");
    fila.append(
        crearCelda(pedido.producto),
        crearCelda(formatearMoneda(pedido.precio)),
        crearCelda(pedido.cantidad),
        crearCelda(formatearMoneda(calcularSubtotal(pedido)))
    );
    return fila;
}

function renderizarTabla(lista) {
    cuerpoTabla.replaceChildren(...lista.map(crearFila));
}

function actualizarIndicadores() {
    totalUnidades.textContent = calcularTotalUnidades(pedidos);
    montoTotal.textContent = formatearMoneda(calcularMontoTotal(pedidos));
}

function actualizarVista() {
    renderizarTabla(filtrarPorPrecio(pedidos, precioMaximoFiltro));
    actualizarIndicadores();
}

function mostrarMensaje(texto, tipo) {
    mensajes.textContent = texto;
    mensajes.className = `alert alert-${tipo}`;
}

function ocultarMensaje() {
    mensajes.textContent = "";
    mensajes.className = "d-none";
}

function limpiarFormulario() {
    inputProducto.value = "";
    inputPrecio.value = "";
    inputCantidad.value = "";
}

// ---------- Acciones de los botones ----------

function agregarPedido() {
    const producto = inputProducto.value.trim();
    const precio = Number(inputPrecio.value);
    const cantidad = Number(inputCantidad.value);

    const errores = obtenerErrores(producto, precio, cantidad);
    if (errores.length > 0) {
        mostrarMensaje(errores.join(" "), "danger");
        return;
    }

    pedidos.push(crearPedido(producto, precio, cantidad));
    limpiarFormulario();
    mostrarMensaje("Pedido agregado correctamente.", "success");
    actualizarVista();
}

function filtrarPedidos() {
    const maximo = Number(inputPrecioMaximo.value);
    if (inputPrecioMaximo.value.trim() === "" || !(maximo > 0)) {
        mostrarMensaje("Ingrese un precio máximo mayor que cero.", "danger");
        return;
    }

    precioMaximoFiltro = maximo;
    mostrarMensaje(`Mostrando pedidos con precio menor o igual a ${formatearMoneda(maximo)}.`, "info");
    actualizarVista();
}

function mostrarTodos() {
    precioMaximoFiltro = null;
    inputPrecioMaximo.value = "";
    ocultarMensaje();
    actualizarVista();
}

function limpiarPedidos() {
    pedidos = [];
    precioMaximoFiltro = null;
    inputPrecioMaximo.value = "";
    mostrarMensaje("Se eliminaron todos los pedidos.", "warning");
    actualizarVista();
}

// ---------- Eventos ----------

btnAgregar.addEventListener("click", agregarPedido);
btnFiltrar.addEventListener("click", filtrarPedidos);
btnMostrarTodos.addEventListener("click", mostrarTodos);
btnLimpiar.addEventListener("click", limpiarPedidos);

// Muestra los indicadores iniciales (0 unidades y $0.00)
actualizarVista();
