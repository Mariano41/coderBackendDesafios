import { Router } from "express";
import ProductManager from "../models/ProductManager.js";

const productos = new ProductManager('../../data/productos.json');
const router = Router();



router.get('/', (req, res) => {
    const { limit } = req.query;
    const p = productos.getProduct();
    let cantProductos;
    if (limit)
        cantProductos = p.slice(0, limit)
    else
        cantProductos = p;
    return res.json({ cantTotal: p.length, productosLimitados: cantProductos });
});

// router.post("/", (req, res) => {
//     const produ = req.body;
//     productos.push(produ);
//     res.status(201).json(produ);
// });

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, price, img, code, stock } = req.body;
    const producto = productos.find((producto) => producto.id == id);
    if (producto) {
        producto.title = title;
        producto.description = description;
        producto.price = price;
        producto.img = img;
        producto.code = code;
        producto.stock = stock;
        return res.json(producto);
    }
    res.json({ error: "Producto no encontrado" })
})

// router.delete ("/:id", (req, res) => {
//     const {id} = req.params;
//     const producto = productos.find((producto) => producto.id == id);
//     if (producto){
//         const index = productos.indexOf(producto);
//         productos.splice(index, 1);
//         return res.json(producto);
//     }
//     res.json({error: "Producto no encontrado"})
// })

router.get('/:id', (req, res) => {
    const { id } = req.params
    return res.json(productos.getProductById(parseInt(id)))
});


export default router;