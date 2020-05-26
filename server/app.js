const express = require("express");
const app = express();

  ////    STARTUP
  app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
})

////    MIDDLEWARES GENERALES
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const router = require("./router/index");
router(app);

module.exports = app;
