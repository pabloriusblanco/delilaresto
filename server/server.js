const express = require("express");
const server = express();

////JWT///
const jwt = require("jsonwebtoken")
const firmaSegura = "firmadeJason";

////////////////////////////////MIDDLEWARE
//////GENERALES
const bodyParser = require("body-parser");
server.use(bodyParser.json())

////STARTUP SERVIDOR////
server.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
})



////////ENDPOINTS/////////
/////GET
server.get("/usuarios", (req, res) => {
    res.json("hello world");
});