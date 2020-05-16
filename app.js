const express = require("express");
const server = express();

////    STARTUP
server.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
})

////    MIDDLEWARES GENERALES
const bodyParser = require('body-parser');
server.use(bodyParser.json())
// const manejoErrores = require("") /// MANEJO DE ERRORES
// server.use()

////    RUTAS
// const pedidos = require("./rutas/pedidos")
// const productos = require("./rutas/productos")
const usuarios = require("./rutas/usuarios")
// pedidos(server);
// productos(server);
usuarios(server);


