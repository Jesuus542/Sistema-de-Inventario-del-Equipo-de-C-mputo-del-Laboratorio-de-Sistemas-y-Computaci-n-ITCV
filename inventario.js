// Variables globales
const usuarioCorrecto = 'admin';
const contrasenaCorrecta = '1234';

// Función para iniciar sesión
function iniciarSesion() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    if (usuario === usuarioCorrecto && contrasena === contrasenaCorrecta) {
        localStorage.setItem('sesionActiva', 'true');
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('contenido').style.display = 'block';
        cargarInventario();
        // Limpiar campos de usuario y contraseña
        document.getElementById('usuario').value = '';
        document.getElementById('contrasena').value = '';
        return false; // Evitar el envío del formulario
    } else {
        document.getElementById('mensaje-error').style.display = 'block';
        return false; // Evitar el envío del formulario
    }
}

// Función para verificar si la sesión está activa
function verificarSesion() {
    if (localStorage.getItem('sesionActiva') === 'true') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('contenido').style.display = 'block';
        cargarInventario();
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Mostrar un mensaje de confirmación antes de cerrar sesión
    const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmacion) {
        localStorage.removeItem('sesionActiva');
        document.getElementById('contenido').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        // Limpiar campos de usuario y contraseña
        document.getElementById('usuario').value = '';
        document.getElementById('contrasena').value = '';
    }
}

// Función para agregar un nuevo elemento al inventario
function agregarElemento() {
    const id = parseInt(document.getElementById('id').value, 10);
    const nombre = document.getElementById('nombre').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);

    if (isNaN(id) || !nombre || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingrese un ID válido, un nombre válido y una cantidad positiva.');
        return;
    }

    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];

    // Verificar si el nombre ya existe en el inventario
    const nombreExistente = inventario.find(item => item.nombre === nombre);
    if (nombreExistente) {
        alert('El nombre ya existe en el inventario. No se puede añadir un nuevo ID con un nombre ya existente.');
        return;
    }

    // Verificar si el ID ya existe en el inventario
    const elementoExistente = inventario.find(item => item.id === id);
    if (elementoExistente) {
        if (elementoExistente.nombre === nombre) {
            elementoExistente.cantidad += cantidad;
        } else {
            alert('El ID ya existe con un nombre diferente. Verifique el ID o nombre.');
            return;
        }
    } else {
        inventario.push({ id, nombre, cantidad });
    }

    localStorage.setItem('inventario', JSON.stringify(inventario));
    cargarInventario();
    document.getElementById('id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('cantidad').value = '';
}

// Función para cargar el inventario y mostrarlo en la lista
function cargarInventario() {
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    const listaInventario = document.getElementById('lista-inventario');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    listaInventario.innerHTML = '';

    if (inventario.length === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';

        inventario.forEach(item => {
            const elemento = document.createElement('li');
            elemento.innerHTML = `
                ID: ${item.id} | Nombre: ${item.nombre} | Cantidad: ${item.cantidad}
                <button class="elemento-boton" onclick="aumentarCantidad(${item.id})"> + </button>
                <button class="elemento-boton" onclick="disminuirCantidad(${item.id})"> - </button>
                <button class="btn-eliminar" onclick="eliminarElemento(${item.id})">Eliminar</button>
            `;
            listaInventario.appendChild(elemento);
        });
    }
}

// Función para aumentar la cantidad de un elemento
function aumentarCantidad(id) {
    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    const elemento = inventario.find(item => item.id === id);

    if (elemento) {
        elemento.cantidad++;
        localStorage.setItem('inventario', JSON.stringify(inventario));
        cargarInventario();
    }
}

// Función para disminuir la cantidad de un elemento
function disminuirCantidad(id) {
    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    const elemento = inventario.find(item => item.id === id);

    if (elemento) {
        if (elemento.cantidad > 1) {
            elemento.cantidad--;
            } else {
            inventario = inventario.filter(item => item.id !== id);
        }

        localStorage.setItem('inventario', JSON.stringify(inventario));
        cargarInventario();
    }
}

// Función para eliminar un elemento del inventario
function eliminarElemento(id) {
    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    inventario = inventario.filter(item => item.id !== id);

    localStorage.setItem('inventario', JSON.stringify(inventario));
    cargarInventario();
}

// Función para buscar un elemento por ID o nombre
function buscarElemento() {
    const termino = document.getElementById('buscador').value.toLowerCase();
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    const listaInventario = document.getElementById('lista-inventario');

    listaInventario.innerHTML = '';

    inventario
        .filter(item => item.nombre.toLowerCase().includes(termino) || item.id.toString().includes(termino))
        .forEach(item => {
            const elemento = document.createElement('li');
            elemento.innerHTML = `
                ID: ${item.id} | Nombre: ${item.nombre} | Cantidad: ${item.cantidad}
                <button class="elemento-boton" onclick="aumentarCantidad(${item.id})"> + </button>
                <button class="elemento-boton" onclick="disminuirCantidad(${item.id})"> - </button>
                <button class="btn-eliminar" onclick="eliminarElemento(${item.id})">Eliminar</button>
            `;
            listaInventario.appendChild(elemento);
        });

    if (listaInventario.innerHTML === '') {
        const mensajeVacio = document.createElement('p');
        mensajeVacio.textContent = 'No se encontraron elementos.';
        listaInventario.appendChild(mensajeVacio);
    }
}

// Función para generar el PDF del inventario
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];

    if (inventario.length === 0) {
        alert('El inventario está vacío. No hay nada que generar en el PDF.');
        return;
    }

    doc.text('Sistema de Inventario del Equipo de Cómputo del Laboratorio de Sistemas y Computación ITCV', 10, 10);
    doc.autoTable({
        head: [['ID', 'Nombre', 'Cantidad']],
        body: inventario.map(item => [item.id, item.nombre, item.cantidad]),
    });

    doc.save('inventario.pdf');
}

// Asignar la función al botón de generar PDF
document.getElementById('btn-generar-pdf').addEventListener('click', generarPDF);

// Verificar la sesión al cargar la página
document.addEventListener('DOMContentLoaded', verificarSesion);
