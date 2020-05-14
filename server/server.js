const express = require("express");
const server = express();
const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysql://root@localhost:3306/delilahresto");
const sqlmodule = require("./modulospersonales/sqlInteraccion.js")
////MODULOS PERSONALES
 

////JWT///
const jwt = require("jsonwebtoken")
const firmaSegura = "MU2VveVGfDalfNanw1r1";


////STARTUP SERVIDOR////
server.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
})

////////////////////////////////MIDDLEWARE
//////GENERALES
const bodyParser = require("body-parser");
server.use(bodyParser.json())


//// MIDDLEWARE POST
function verifEmail(req, res, next) {
    console.log(req.body);
    const { username, email } = req.body;
    if (!username && !email) {
        console.log(req.body);
        res.status(409).send({ err: "Falta completar campos" });
    }
    else {
        let emailencontrado = arrayUsuariosFaker.find(elemento => elemento.email == email);
        let usernameencontrado = arrayUsuariosFaker.find(elemento => elemento.username == username && elemento.username == username);
        if (!emailencontrado || !usernameencontrado) {
            res.locals.usuarioEncontrado = false;
            next();
        }
        else {
            console.log("Encontro al usuario");
            res.locals.usuarioEncontrado = true;
            if (emailencontrado) {
                res.locals.usuario = emailencontrado;
            }
            if (usernameencontrado) {
                res.locals.usuario = usernameencontrado;
            }
            next();
        }
    }
}




////////ENDPOINTS/////////
/////GET
server.get("/usuarios", (req, res) => {
    res.json("hello world" + sqlmodule.constSQL.readUsersAll());
});

/////POST
server.post("/usuarios/registro",verifEmail, (req, res) => {
    if (res.locals.usuarioEncontrado == true) {
        res.json(res.locals.usuario);
    }
    else {
        res.json(res.locals.usuarioEncontrado);
    }
});
