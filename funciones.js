let cart = [];
const cartItemsList = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const cartCountEl = document.getElementById('cart-count');

// Escuchar clics en botones de añadir
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));

        addToCart(id, name, price);
    });
});

function addToCart(id, name, price) {
    // Verificar si ya existe para aumentar cantidad
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateUI();
}

function updateUI() {
    // Limpiar lista
    cartItemsList.innerHTML = '';
    
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;
        cartItemsList.appendChild(li);
        
        total += item.price * item.quantity;
        count += item.quantity;
    });

    totalPriceEl.textContent = total.toFixed(2);
    cartCountEl.textContent = count;
}

// Vaciar carrito
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    updateUI();
});

//Inicio de Sesión y Registro de Usuarios

//script de Registro de usuarios
function registrar(){
    
    let usuario=document.getElementById("nuevoUsuario").value;
    let clave=document.getElementById("nuevaClave").value;

    if (usuario === "" || clave === ""){
        alert("Por favor, ingrese los campos requeridos");
        return;
    }
    let usuarios=JSON.parse(localStorage.getItem("usuarios")) || [];

    let nuevoUsuario ={
        usuario: usuario,
        clave: clave
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.replace("login.html");
}

//script de Login
function login(){

    let usuario=document.getElementById("usuario").value;
    let clave=document.getElementById("clave").value;

    let usuarios=JSON.parse(localStorage.getItem("usuarios")) || [];

    let encontrado=usuarios.find(u=> u.usuario === usuario && u.clave === clave);

    if(encontrado){
        alert("¡Bienvenido!");

        window.location.href= ("index.html");

        }else{
        alert("Usuario o contraseña incorrectas");
        alert("Ingrese los datos correctos");
        }
}

//DECLARAMOS VARIABLES PARA HACER FUNCIONAR NUESTRO CARRITO DE COMPRAS
let cart = []; //Array temporal para almacenar los productos agregados al carrito
let facturas = JSON.parse(localStorage.getItem('facturas')) || []; //Array para almacenar las facturas en el localStorage

//FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
//Escuchar clicks en todos los botones de "Agregar al carrito"
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id'); //Obtenemos el id del producto
        const name = e.target.getAttribute('data-name'); //Obtenemos el nombre del producto
        const price = parseFloat(e.target.getAttribute('data-price')); //Obtenemos el precio del producto y lo convertimos a número

        //Agregar el producto al carrito
        cart.push({ id, name, price });
        actualizarInterfazCarrito(); //Actualizar la interfaz del carrito
    });
});

//ACTUALIZAR LA LISTA DE COMPRAS Y EL PRECIO TOTAL
function actualizarInterfazCarrito() {
    const cartItemsContainer = document.getElementById('cart-items'); //Contenedor de los items del carrito
    const totalPriceElement = document.getElementById('total-price'); //Elemento donde se mostrará el precio total

    //Si, los elementos no existen en la pagina actual, salimos para evitar errores en el mommento de la ejecucion
    if (!cartItemsElement || !totalPriceElement) return;

    //Limpiar la lista de items del carrito
    cartItemsElement.innerHTML = '';
    let total = 0; //Variable para almacenar el precio total

    //Agregar cada producto seleccionado al carrito
    cart.forEach(item => {
        const li = document.createElement('li'); //Crear un elemento de lista
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`; //Agregar el nombre y precio del producto al elemento de lista
        cartItemsElement.appendChild(li); //Agregar el elemento de lista al contenedor del carrito
        total += item.price; //Sumar el precio del producto al total
    });

    //Actualizar el precio total
    totalPriceElement.textContent = total.toFixed(2); //Mostrar el precio total con dos decimales
}

//ESCHUCHAR EL BOTON DE "VACIAR EL CARRITO"
const btnVaciar = document.getElementById('clear-cart');
btnVaciar.addEventListener('click', () => {
    cart = []; //Vaciar el carrito
    actualizarInterfazCarrito(); //Actualizar la interfaz del carrito
});


//SISTEMA CRUD DE FACTURACION 

//Operacion: CREATE (Generar y guardar factura al comprar)
function procesarCompra() {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de confirmar la compra.');
        return;
    }

    //Calcular el costo total sumando los precios de los productos seleccionados
    const totalCalculado = cart.reduce((sum, item) => sum + item.price, 0);

    //Crear la factura con datos únicos
    const nuevaFactura = {
        id: 'FAC-' + Date.now(), //Generar un ID único basado en la fecha y hora actual
        fecha: new Date().toLocaleDateString(), //Obtener la fecha actual en formato local
        productos: [...cart], //Copiar los productos del carrito a la factura
        total: totalCalculado,
        estado: 'Pendiente' //Estado inicial de la factura
    };

    // Guardar en nuestro arreglo general y actualizar el LocalStorage
    facturas.push(nuevaFactura);
    localStorage.setItem('facturas', JSON.stringify(facturas));

    // Limpiar el carrito después de facturar
    cart = [];
    actualizarInterfazCarrito();
    
    alert(`🛒 ¡Compra exitosa! Se ha generado la factura: ${nuevaFactura.id}`);
    
    // Si la tabla de administración está en la misma página, la actualiza de inmediato
    mostrarFacturasAdmin(); 
}

//OPERACION: READ (Mostrar facturas en la tabla de administración)
function mostrarFacturasAdmin() {
    const tablaFacturas = document.getElementById('tabla-facturas');
    if (!tablaFacturas) return; //Si no existe la tabla, salir de la función

    tablaFacturas.innerHTML = ''; //Limpiar la tabla antes de llenarla

    //Recorrer todas las facturas y agregarlas a la tabla
    facturas.forEach((factura, index) => {
        const tr = document.createElement('tr');

        // Unir los nombres de los productos comprados separados por comas
        const listaProductos = factura.productos.map(p => p.name).join(', ');

        tr.innerHTML = `
            <td><strong>${factura.id}</strong></td>
            <td>${factura.fecha}</td>
            <td>${listaProductos}</td>
            <td>$${factura.total.toFixed(2)}</td>
            <td><span class="status-badge ${factura.estado.toLowerCase()}">${factura.estado}</span></td>
            <td>
                <!-- Botón UPDATE -->
                <button onclick="cambiarEstadoFactura(${index})" class="btn-edit">🔄 Cambiar Estado</button>
                <!-- Botón DELETE -->
                <button onclick="eliminarFactura(${index})" class="btn-delete-factura">🗑️ Borrar</button>
            </td>
        `;
        tablaFacturas.appendChild(tr);
    });
}

//OPERACION: UPDATE (Cambiar el estado de una factura)
window.cambiarEstadoFactura = function(index) {
    // Si está pendiente pasa a completado, y viceversa
    if (facturas[index].estado === 'Pendiente') {
        facturas[index].estado = 'Completado';
    } else {
        facturas[index].estado = 'Pendiente';
    }

    // Guardar cambios en LocalStorage y refrescar tabla
    localStorage.setItem('facturas', JSON.stringify(facturas));
    mostrarFacturasAdmin();
};

//OPERACION: DELETE (Eliminar una factura)
window.eliminarFactura = function(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de facturación de forma permanente?")) {
        facturas.splice(index, 1); // Remover del array por su índice
        localStorage.setItem('facturas', JSON.stringify(facturas)); // Guardar cambios
        mostrarFacturasAdmin(); // Refrescar la tabla
    }
};

//INICIALIZADOR DE EVENTOS AL CARGAR LA PAGINA
document.addEventListener('DOMContentLoaded', () => {
    // Dibujar la tabla de administración al cargar por si ya hay facturas viejas guardadas
    mostrarFacturasAdmin();
    
    // Vincular el botón "Confirmar Compra" (`checkout-btn`) con la función de facturación
    const btnConfirmarCompra = document.getElementById('checkout-btn');
    if (btnConfirmarCompra) {
        btnConfirmarCompra.addEventListener('click', procesarCompra);
    }
});