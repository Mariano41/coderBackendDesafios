import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import ProductManager from '../models/ProductManager.js';

export default class Carrito{

static #id;
#path;
#carts;
#products;

    constructor(path) {
        this.#path = './src/data/carts.json';
        this.#carts = this.#leerArchivo();
        Carrito.#id = this.#carts.length > 0 ? this.#carts[this.#carts.length - 1].id : 0;
        this.#products = new ProductManager()
    }

    #leerArchivo() {
        try {
            let data;
            if (existsSync(this.#path))
                data = JSON.parse(readFileSync(this.#path, 'utf-8'));
            else
                data = [];

            return data;
        } catch (error) {
            console.log(error);
        }
    }

crearCarrito(){
    try{
        const newCart={
            id: ++Carrito.#id,
            products: [],
        }

    this.#carts.push(newCart);
    writeFileSync(this.#path, JSON.stringify(this.#carts));
    return 'Nuevo carrito creado 🛒'

    } catch (error){
        console.log(error);
    }

}

getCarts() {
    return this.#carts;
}

getCartById(id) {
    const carritoId = this.#carts.find(p => p.id === id);

    return carritoId ? carritoId : `Carrito inexistente`;
}

addProductCart(idCarrito, idProduct){
    try {
        let mensaje;
        
        const indiceCarrito = this.#carts.findIndex( c => c.id == idCarrito)
        const existeProducto = this.#products.getProductCartById(idProduct);

        if(indiceCarrito!=-1 && existeProducto){

            const indiceProduct = this.#carts[indiceCarrito].products.findIndex( p => p.id == idProduct)

            if(indiceProduct!=-1){
                this.#carts[indiceCarrito].products[indiceProduct].quantity = this.#carts[indiceCarrito].products[indiceProduct].quantity+1
            }else{
                const producto = {
                    id: idProduct,
                    quantity: 1
                }
                this.#carts[indiceCarrito].products.push(producto)

            }

            writeFileSync(this.#path, JSON.stringify(this.#carts));

            mensaje = "Producto agregado al Carrito"

        }else{
            mensaje= ""
        }

        return mensaje
    } catch (error) {
        
    }
}
}

