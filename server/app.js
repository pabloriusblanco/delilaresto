const express = require("express");
const app = express();

  ////    STARTUP
  app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
})

////    MIDDLEWARES GENERALES
const bodyParser = require('body-parser');
app.use(bodyParser.json())
// const manejoErrores = require("") /// MANEJO DE ERRORES
// server.use()

const router = require("./router/index");
router(app);

module.exports = app;

// https://blog.logrocket.com/the-perfect-architecture-flow-for-your-next-node-js-project/
// https://docs.oracle.com/cd/E93130_01/service_layer/service%20layer%20API/Content/Service%20Layer%20Architecture/Service%20Layer%20Architecture.htm