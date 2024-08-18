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
    localStorage.removeItem('sesionActiva');
    document.getElementById('contenido').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    // Limpiar campos de usuario y contraseña
    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';
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

    listaInventario.innerHTML = '';

    inventario.forEach(item => {
        const elemento = document.createElement('li');
        elemento.innerHTML = `
            ID: ${item.id} | Nombre: ${item.nombre} | Cantidad: ${item.cantidad}
            <button onclick="aumentarCantidad(${item.id})"> + </button>
            <button onclick="disminuirCantidad(${item.id})"> - </button>
        `;
        listaInventario.appendChild(elemento);
    });
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

// Función para buscar un elemento por ID o nombre
function buscarElemento() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    const listaInventario = document.getElementById('lista-inventario');

    listaInventario.innerHTML = '';

    const resultados = inventario.filter(item => 
        item.id.toString().includes(query) || item.nombre.toLowerCase().includes(query)
    );

    resultados.forEach(item => {
        const elemento = document.createElement('li');
        elemento.innerHTML = `
            ID: ${item.id} | Nombre: ${item.nombre} | Cantidad: ${item.cantidad}
            <button onclick="aumentarCantidad(${item.id})"> + </button>
            <button onclick="disminuirCantidad(${item.id})"> - </button>
        `;
        listaInventario.appendChild(elemento);
    });
}

// Función para eliminar todo el inventario (comentada por ahora)
// function eliminarInventario() {
//     if (confirm('¿Estás seguro de que quieres eliminar todo el inventario?')) {
//         localStorage.removeItem('inventario');
//         cargarInventario();
//     }
// }

// Verificar el estado de la sesión al cargar la página
document.addEventListener('DOMContentLoaded', verificarSesion);
