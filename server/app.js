const express = require("express");
const app = express();

const port = 3000; /// default


////    STARTUP
app.listen(port, () => {
  console.log("Servidor iniciado en puerto " + port);
})

////    MIDDLEWARES GENERALES
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const router = require("./router/index");
router(app);

module.exports = app;
