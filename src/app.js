import express from 'express';
// import { handlebars } from 'hbs';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';

import products from "./routes/productos.router.js";
import carts from './routes/carts.js';
import __dirname from '../utils.js'

import {Server} from 'socket.io'
import ProductManager from './models/ProductManager.js';

// const fileStorage = FileStore(session)

const app = express ()

const productos = new ProductManager()

const port = 8080;

app.use(express.static('src/public'));

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter)

app.engine("handlebars", handlebars.engine());
app.set('view engine', 'handlebars');
app.set("views", `${__dirname}/src/views`);

// hbs.registerPartials(__dirname + '/views/partials');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(`${__dirname}/public`));

mongoose.connect("mongodb+srv://MarianoBriozzo:929390@cluster0.rmtkxoi.mongodb.net/?retryWrites=true&w=majority")

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://MarianoBriozzo:929390@cluster0.rmtkxoi.mongodb.net/?retryWrites=true&w=majority",
        ttl: 60,
    }),
    secret: "Codersecret",
    resave: false,
    saveUninitalized: true ,
}))


app.use('/api/products', products)
app.use('/api/carts', carts)


function auth (req, res, next) {
    if (req.session?.user === "Roberto" && req.session?.admin){
        return next ()
    }
    return res.status(401).send("error de autorizacion")
}

app.get("/", (req, res) =>{
    res.send('Hi')
})

app.get('/productos', (req, res) =>{
    return res.send('productos')
})

app.get('/accesorios', (req, res) =>{
    return res.send('accesorios')
})

app.get("/setCookie", (req, res) => {
    res
    .cookie("CoderCookie", "Aca esta la cookie", {maxAge: 100000, signed: true})
    .send("Cookie")
})

app.get("/getCookie", (req, res) => {
    res.send(req.cookies)
})

app.get("/deleteCookie", (req, res) => {
    res.clearCookie("CoderCookie").send("Se elimino la Cookie")
})

// app.get("/session", (req, res) => {
//     if(req.session.counter) {
//         req.session.counter++
//         res.send(`Visitaste este sitio ${req.session.counter} veces`)
//     } else{
//         req.session.counter = 1
//         res.send("Bienvenidos")
//     }
// })

app.get("/privada", auth, (req, res) => {
    res.send("Ya te logueaste")
})

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send({status: "Error", err})
        res.send("logout")
    })
})





app.get('*', (req, res) =>{
    return res.send('404')
})




const httpServer = app.listen(port, () => {
    console.log(`Corriendo en el puerto ${port}`);
});

const io = new Server(httpServer)

io.on('connection', socket =>{
    console.log('Cliente conectado');
})
    io.on('disconnect', () =>{
        console.log('El cliente se desconecto');
    })
