import { ControladorCarrito, ControladorBBDD } from './controlador/controlador.js';

listeners();
imprimirFiltrosEnPantalla();
imprimirProductosEnPantalla();
cargarCarritoDeLaCompra();

/**
 * Esta función crea los listeners necesarios para que la página funcione correctamente.
 */
function listeners() {
  //Filtro
  document.getElementById('filtro-categoria').addEventListener('click', callbackEventoFiltro, false);

  //Carritos
  document.getElementById('carrito').addEventListener('mouseover', mostrarCarrito, false);
  document.getElementById('carrito').addEventListener('mouseout', ocultarCarrito, false);

  //Guardar producto
  document.getElementById('products-container').addEventListener('click', guardarProducto, false);
  document.getElementById('products-container').addEventListener('click', cargarCarritoDeLaCompra, false);

  //Imprimir localStorage
  document.getElementById('filtro-categoria').addEventListener('click', ControladorCarrito.imprimirLocalStorage, false);

  //Limpia el carrito de localStorage
  document.getElementById('vaciarCarrito').addEventListener('click', limpiarCarrito, false);

  //Elimina el producto deseado del carrito
  document.getElementById('contenedor-carro').addEventListener('click', eliminarProductoCarrito, false);
}

/**
 * Muestra un mensaje que dura unos segundos cuando el cliente realiza una acción
 * @param {string} mensaje
 */
function mostrarMensajeFlotante(mensaje) {
  let mensajeFlotante = document.getElementById('miMensaje');
  mensajeFlotante.style.display = 'block';
  mensajeFlotante.innerHTML = mensaje;
  setTimeout(() => {
    mensajeFlotante.style.display = 'none';
  }, 2000);
}

/**
 * Comprueba que se le ha dado a eliminar producto, obtiene el id del producto y llama al controlador al método de eliminar producto, si devuelve true se vuelve a rellenar el carrito con los productos del localStorage y se muestra un mensaje y si devuelve falso, no existia el producto por lo tanto se muestra un mensaje de error.
 * @param {event} e
 */
function eliminarProductoCarrito(e) {
  if (e.target.innerHTML === 'X') {
    let idProd = e.target.id.split('-')[1];
    if (ControladorCarrito.eliminarProductoCarritoPorId(idProd)) {
      cargarCarritoDeLaCompra();
      mostrarMensajeFlotante('Producto eliminado del carrito.');
    } else {
      mostrarMensajeFlotante('Ha ocurrido un error.');
    }
  }
}

/**
 * Al hacer click en Vaciar Carrito del carrito de la compra se llama a la función del controlador de limpiar el Carrito, limpia el local Storage y por último llama a la función cargarCarrito para que se vuelva por defecto.
 */
function limpiarCarrito() {
  ControladorCarrito.limpiarCarrito();
  cargarCarritoDeLaCompra();
  mostrarMensajeFlotante('Se ha vaciado el carrito.');
}

/**
 * Comprueba que el elemento seleccionado es la imagen del produto o el botón de añadir al carrito del producto y llama a la función del controlador de añadir produto al carrito, pasandole como parámetro el elemento una vez convertido a JSON.
 * @param {evento} e
 */
function guardarProducto(e) {
  if (e.target.id === 'imgAñadirCarrito' || e.target.id === 'añadirCarrito') {
    let JsonProducto2 = ControladorBBDD.obtenerProductoJson(e.target);
    ControladorCarrito.guardarProductoCarrito(JsonProducto2);
    mostrarMensajeFlotante('Producto añadido al carrito.');
  }
}

/**
 * Esta función oculta el carrito al dejar de pasar el ratón por encima del carrito
 */
function ocultarCarrito() {
  document.getElementById('lista-carrito').classList.add('d-none');
  document.getElementById('lista-carrito').classList.remove('d-lg-table-row');
}

/**
 * Esta función muestra el carrito al pasar por encima el ratón.
 */
function mostrarCarrito() {
  document.getElementById('lista-carrito').classList.remove('d-none');
  document.getElementById('lista-carrito').classList.add('d-lg-table-row');
}

/**
 * Comprueba que no esta vacio localStorage, en caso de que no, limpia el carrito y lo vuelve por defecto, obtiene los productos del localStorage y los introduce en el carrito, y en caso de que el localStorage este vacio se vuelve el carrito por defecto.
 */
function cargarCarritoDeLaCompra() {
  if (localStorage.length !== 0) {
    carritoPorDefecto();
    for (let index = 0; index < localStorage.length; index++) {
      let idProd = localStorage.key(index);
      document.getElementById('contenedor-carro').innerHTML += crearHTMLCarrito(
        JSON.parse(localStorage.getItem(idProd))
      );
    }
  } else {
    carritoPorDefecto();
  }
}

/**
 * Se le pasan los datos del producto y crea un HTML con los datos.
 * @param {producto} producto
 * @returns string
 */
function crearHTMLCarrito(producto) {
  return `<tr>
                <td><img class="w-25" src="${producto['imagen']}" alt="imgProd" /></td>
                <td>${producto['nombre']}</td>
                <td>${producto['precio']}</td>
                <td>${producto['cantidad']}</td>
                <td><a href="#" id="prod-${producto['id']}" class="borrar-curso" data-id="${producto['id']}">X</a></td>
              </tr>`;
}

/**
 * Comprueba y retorna los filtros que estan check
 * @returns array
 */
function comprobarCheckFiltros() {
  let checkboxs = document.querySelectorAll('input[type="checkbox"]:checked');
  let checked = [];
  for (let index = 0; index < checkboxs.length; index++) {
    checked.push(checkboxs[index].value);
  }
  return checked;
}

/**
 * Se le pasan por parámetros las categorias seleccionadas, se crea una array con los productos que cumplen con el filtro. Posteriormente se llama a la función imprimirProductosFiltradosEnPantalla para que imprima en pantalla los productos
 * @param {array} categorias
 */
function aplicarFiltro(categorias) {
  let productosFiltrados = ControladorBBDD.obtenerProductos().filter((element) => {
    for (let index = 0; index < categorias.length; index++) {
      if (element.categoria === categorias[index]) {
        return element.id;
      }
    }
  });

  imprimirProductosFiltradosEnPantalla(productosFiltrados);
}

/**
 * Mediante la función comprobarCheckFiltros se llega una array con los filtros seleccionados, si hay 1 o más filtros en el array llama a la función aplicarFiltro que ya se encarga de filtrar los productos, sino tiene ningun producto llama a al función imprimirProductosEnPantalla e imprime todos los productos
 * @param {event} e
 */
function callbackEventoFiltro(e) {
  //Comprobamos que seleccionamos un input y no otro elemento
  if (e.target.nodeName === 'INPUT') {
    let filtrosChecked = comprobarCheckFiltros();
    if (filtrosChecked.length === 0) {
      imprimirProductosEnPantalla();
    } else {
      aplicarFiltro(filtrosChecked);
    }
  }
}

/**
 * Obtiene los productos filtrados por parámetros y los imprime en pantalla
 * @param {array} productosFiltrados
 */
function imprimirProductosFiltradosEnPantalla(productosFiltrados) {
  let containerProductos = document.getElementById('products-container');
  limpiarElementoHTML(containerProductos);
  for (let index = 0; index < productosFiltrados.length; index++) {
    containerProductos.innerHTML += crearHTMLProductos(productosFiltrados[index]);
  }
}

/**
 * Obtiene los filtros del controlador de la base de datos, y llama a la función para crear el html de los filtros con los datos.
 */
function imprimirFiltrosEnPantalla() {
  let filtros = ControladorBBDD.obtenerFiltros();
  let containerFiltros = document.getElementById('filtro-categoria');
  for (let index = 0; index < filtros.length; index++) {
    containerFiltros.innerHTML += crearHTMLFiltros(filtros[index]);
  }
}

/**
 * Retorna un html con las propiedades de los filtros para que se inyecte posteriormente en el html principal.
 * @param {array} filtros
 * @returns string
 */
function crearHTMLFiltros(filtros) {
  const { id, nombre } = filtros;
  return `<div class=" contenedor-categoria">
  <input type="checkbox" id="${id}" name="${id}" value="${id}" />
  <label for="${id}">${nombre}</label>
  </div>`;
}

/**
 * Obtiene los productos del controlador de la base de datos y los pasa como parámetro a la función de crear html
 */
function imprimirProductosEnPantalla() {
  let productos = ControladorBBDD.obtenerProductos();
  let containerProductos = document.getElementById('products-container');
  limpiarElementoHTML(containerProductos);
  for (let index = 0; index < productos.length; index++) {
    containerProductos.innerHTML += crearHTMLProductos(productos[index]);
  }
}

/**
 * Se le pasan por parámetros los productos y lo inyecta en el html
 * @param {array} productos
 */
function crearHTMLProductos(productos) {
  const { id, nombre, categoria, imagen, precio, vendedor, stock } = productos;

  return `    <article id="${id}" class=" m-2 d-flex justify-content-center align-items-center flex-column p-2 card location-listing" data-categoria="${categoria}">
      <div class="location-image">
        <a href="#">
          <img id="imgAñadirCarrito" class=" w-100" src="${imagen}" alt="Placa base Asus" />
        </a>
      </div>
      <div class="data d-flex justify-content-center align-items-center flex-column">
        <h4>${nombre}</h4>
        <p class="price">${precio}€</p>
        <p>Vendido por <strong>${vendedor}</strong></p>
        <p>Quedan ${stock} unidades</p>
        <div class="button-container">
          <button id="añadirCarrito" class="button add btn btn-primary">Añadir al carrito</button>
        </div>
      </div>
    </article>`;
}

/**
 * Se le introduce un campo y lo deja vacio
 * @param {*} campo
 */
function limpiarElementoHTML(campo) {
  campo.innerHTML = '';
}

/**
 * Deja el carrito por defecto sin ningún producto
 */
function carritoPorDefecto() {
  document.getElementById('contenedor-carro').innerHTML = `<th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th></th>`;
}
