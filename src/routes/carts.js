import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { Router } from "express";
import Carrito from '../models/carts.js';

const router = Router ();

const cart = new Carrito();

router.get('/', (req, res) =>{
    const result = cart.getCarts()
    return res.json({ result })
});

router.get('/:id', (req, res) =>{ 
    const result = getCartById(parseInt(req.params.id))
    return res.json({ result})
});

router.post('/', (req, res) =>{
    const nuevoCarro = cart.createCart()
    return res.json({ nuevoCarro })
});

router.post('/:id/products/:pid', (req, res) =>{
    const {id, pid} = req.params;
    const result = cart.addProductCart(parseInt(id), parseint(pid))
    return res.json({ mensaje: 'Post carts'})
});

export default router;