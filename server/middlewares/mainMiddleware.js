const depenGenerales = require("../depenGenerales");


const mainMiddleware = {
    jwtAut: async function (req, res, next) { ///Login con JWT. Evalua si existe el JWT, lo desencripta y pasa por res.locals al usuario que se utilizara en el resto de los middlewares
        if (req.headers.authorization) {
            let jwtVerified = depenGenerales.jwt.verify(req.headers.authorization.split(" ")[1], depenGenerales.firmaSegura)
            res.locals.usuarioLogeado = await depenGenerales.sequelize.query("SELECT * FROM usuarios WHERE usuarios.id =:id",
            { replacements: { id: jwtVerified}, type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (res.locals.usuarioLogeado.length) {
                next()
            } else {
                res.status(403).send("No tiene permisos para acceder");
            }
        } else {
            res.status(403).send("Necesita estar logeado para realizar esa accion");
        }

    },
    emailUsuarioExistente: async function (req, res, next) { /////Revisa si existe el mail o el usuario, porque el cliente se puede logear con cualquiera de los dos
        const { usuario, password, nombreyapellido, email, telefono, direccion } = req.body;
        console.log(usuario, password, nombreyapellido, email, telefono, direccion);
        if (email || usuario) {
            registrado = await depenGenerales.sequelize.query("SELECT usuario,email FROM usuarios WHERE usuarios.email =:email or usuarios.usuario =:usuario",
                { replacements: { email: email, usuario:usuario}, type: depenGenerales.sequelize.QueryTypes.SELECT });
            console.log(registrado.length);
            // console.log(usuarioregistrado);
            if (registrado.length == 0) {
                next();
            }
            else {
                res.status(403).send("Ese usuario y/o email ya están registrados");
            }
        }
        else {
            res.status(403).send("Debe agregar valores validos para registrarse");
        }
    }
}

module.exports = mainMiddleware;