import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export default class ProductManager {

    static #id;
    #products;
    #path

    constructor(path) {
        this.#path = './src/data/productos.json';
        this.#products = this.#leerArchivo();
        ProductManager.#id = this.#products.length > 0 ? this.#products[this.#products.length - 1].id : 0;
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

    addProduct(title, description, price, img, code, stock) {

        try {
            let mensaje;

            const codigoExistente = this.#products.some(p => p.code === code);

            if (codigoExistente)
                mensaje = `El codigo del producto esta repetido.`;
            else {
                const newProduct = {
                    id: ++ProductManager.#id,
                    title,
                    description,
                    price,
                    img,
                    code,
                    stock,
                };

                if (!Object.values(newProduct).includes(undefined)) {
                    writeFileSync(this.#path, JSON.stringify(this.#products));
                    this.#products.push(newProduct);
                    mensaje = 'El producto se agregó correctamente!';
                } else
                    mensaje = "Todos los campos son obligatorios";

            }

            return mensaje;
        } catch (error) {
            console.log(error);
        }
    }

    getProduct() {
        return this.#products;
    }

    getProductById(id) {
        const productoId = this.#products.find(p => p.id === id);

        return productoId ? productoId : `Producto inexistente`;
    }

    getProductCartById(id) {
        const productoId = this.#products.find(p => p.id === id);

        return productoId ? productoId : false;
    }

    updtaeProduct(id, propiedades) {

        try {
            let mensaje;

            const indice = this.#products.findIndex(p => p.id === id);
            if (indice != -1) {
                const { id, ...rest } = propiedades;
                writeFileSync(this.#path, JSON.stringify(this.#products));
                this.#products[indice] = { ...this.#products[indice], ...rest };
                mensaje = 'Producto actualizado!'
            } else
                mensaje = `Producto inexistente`;

            return mensaje;
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct(id) {
        try {
            let mensaje;
            const indice = this.#products.findIndex(p => p.id === id);

            if (indice >= 0) {
                writeFileSync(this.#path, JSON.stringify(this.#products));
                this.#products.splice(indice, 1);
                mensaje = 'Producto eliminado';
            } else
                mensaje = "Producto inexistente";

            return mensaje;
        } catch (error) {
            console.log(error);
        }
    }
}

const productos = new ProductManager ('./data/productos.json');

// const p1 = productos.addProduct("Guitarra ARIA", "Guitarra Criolla", 45000, "img89", "aaa111", 11);
// const p2 = productos.addProduct("Guitarra ARIA 2", "Guitarra Criolla", 55000, "img90", "bbb111", 1);
// const p3 = productos.addProduct("Guitarra CORT", "Guitarra Criolla", 40000, "img91", "ccc111"); // ERROR DE FALTAN CAMPOS
// const p4 = productos.addProduct("Guitarra Fender", "Guitarra acustica", 125000, "img92", "bbb111", 6); //ERROR MISMO CODIGO DE PRODUCTO
// const p5 = productos.addProduct("Guitarra Guild", "Guitarra acustica", 90000, "img93", "aasdbbb111", 2);

// console.log({p1, p2, p3, p4, p5}); //MOSTRAR PRODUCTOS AGREGADOS EN CONSOLA

// console.log(productos.getProductById(2)) //MOSTRAR PRODUCTO CON ID 2
// console.log(productos.getProductById(9998)) //MOSTRAR PRODUCTO CON ID INEXISTENTE

// console.log(productos.deleteProduct(1)); // ELIMINAR PRODUCTO
// console.log(productos.deleteProduct(9889898));// ELIMINAR PRODUCTO INEXISTENTE
