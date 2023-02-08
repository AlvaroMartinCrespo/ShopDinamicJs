import { productos, categorias } from '../bd/db.js';

/**
 * Controlador Carrito
 */
export class ControladorCarrito {
  /**
   * Imprime el local Storage por consola
   */
  static imprimirLocalStorage() {
    console.log(window.localStorage);
  }

  /**
   * Devuelve true o false dependiendo de si el producto se encuentra en el localStorage o no
   * @param {producto} producto
   * @returns boolean
   */
  static comprobarProductoEnCarrito(producto) {
    if (localStorage.getItem(producto['id'])) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Obtiene el id del producto por parámetros y lo eliminar de localStorage.
   * @param {number} id
   * @returns boolean
   */
  static eliminarProductoCarritoPorId(id) {
    if (localStorage.getItem(id)) {
      localStorage.removeItem(id);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Se comprueba que el producto esta en el localStorage, sino está, se añade al localStorage, si está, se le añade uno a la cantidad y se vuelve a añadir.
   * @param {product} producto
   */
  static guardarProductoCarrito(producto) {
    if (this.comprobarProductoEnCarrito(producto)) {
      let ActualizarProducto = JSON.parse(localStorage.getItem(producto['id']));
      ActualizarProducto.cantidad += 1;
      localStorage.setItem(ActualizarProducto['id'], JSON.stringify(ActualizarProducto));
    } else {
      localStorage.setItem(producto['id'], JSON.stringify(producto));
    }
  }

  /**
   * Limpia todos los productos del carrito
   */
  static limpiarCarrito() {
    localStorage.clear();
  }
}

/**
 * Controlador BBDD
 */
export class ControladorBBDD {
  /**
   * Obtiene los productos de la base de datos
   * @returns array
   */
  static obtenerProductos() {
    let arrayProductos = [];
    for (let index = 0; index < productos.length; index++) {
      arrayProductos[index] = productos[index];
    }
    return arrayProductos;
  }

  /**
   * Obtiene por parámetros un elemento html del producto y revuelve un json con las caracteríticas del producto.
   * @param {elementHTML} producto
   * @returns Json Producto
   */
  static obtenerProductoJson(producto) {
    const productoId = this.obtenerProductoId(producto.parentNode.parentNode.parentNode.id);
    const caracteristicas = {
      id: productoId[0].id,
      nombre: productoId[0].nombre,
      precio: productoId[0].precio,
      imagen: productoId[0].imagen,
      cantidad: 1,
    };
    return caracteristicas;
  }

  /**
   * Obtiene todos los productos, realiza un filter y devuelve el producto que coincida con el producto que tengo el mismo id.
   * @param {string} id
   * @returns producto
   */
  static obtenerProductoId(id) {
    return this.obtenerProductos().filter((element) => {
      return element['id'] === id;
    });
  }

  /**
   * Obtenemos de la base da datos los filtros y el id de cada filtro
   * @returns array
   */
  static obtenerFiltros() {
    let arrayFiltro = [];
    for (let index = 0; index < categorias.length; index++) {
      arrayFiltro[index] = categorias[index];
    }
    return arrayFiltro;
  }
}
