const depenGenerales = require("../depenGenerales");


const mainMiddleware = {
    jwtAut: async function (req, res, next) { ///Login con JWT. Evalua si existe el JWT, lo desencripta y pasa por res.locals al usuario que se utilizara en el resto de los middlewares
        if (req.headers.authorization) {
            let jwtVerified = depenGenerales.jwt.verify(req.headers.authorization.split(" ")[1], depenGenerales.firmaSegura)
            res.locals.usuarioLogeado = await depenGenerales.sequelize.query("SELECT * FROM usuarios WHERE usuarios.id =:id",
                { replacements: { id: jwtVerified }, type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (res.locals.usuarioLogeado.length) {
                next()
            } else {
                res.status(403).send("No tiene permisos para acceder");
            }
        } else {
            res.status(403).send("Necesita estar logeado para realizar esa accion");
        }

    },
    emailUsuarioExistentePost: async function (req, res, next) { /////Revisa si existe el mail o el usuario, porque el cliente se puede logear con cualquiera de los dos
        const { usuario, email } = req.body;
        if (email || usuario) {
            let registrado = await depenGenerales.sequelize.query("SELECT usuario,email FROM usuarios WHERE usuarios.email =:email or usuarios.usuario =:usuario",
                { replacements: { email: email, usuario: usuario }, type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (registrado.length == 0) {
                next();
            }
            else {
                res.status(403).send("Ese usuario y/o email ya están registrados");
            }
        }
        else {
            res.status(403).send("Debe agregar usuario y email para registrarse");
        }
    },

    


        ///Este middleware evalua que el usuario tenga acceso al pedido que está haciendo
        autorizUsuario: async function (req, res, next) {
            let idPedido = req.params.id;
            let usuarioLogeado = res.locals.usuarioLogeado[0];
            if (usuarioLogeado.admin == 1 || usuarioLogeado.id == idPedido) {
                res.locals.usuarioEncontrado = await depenGenerales.sequelize.query("SELECT * FROM usuarios where id=:id",
                    { replacements: { id: idPedido }, type: depenGenerales.sequelize.QueryTypes.SELECT });
                next();
            }
            else {
                res.status(404).send("No tiene acceso");
            }
        }
    }

module.exports = mainMiddleware;




/////ELIMINAR


    // emailUsuarioExistentePut: async function (req, res, next) { /////Revisa si existe el mail o el usuario, porque
    //     const { usuario, email } = req.body;
    //     try {
    //         if (email) {
    //             let registradoEmail = await depenGenerales.sequelize.query("SELECT email FROM usuarios WHERE usuarios.email =:email",
    //                 { replacements: { email: email }, type: depenGenerales.sequelize.QueryTypes.SELECT });
    //             if (registradoEmail.length == 0) {
    //                 usuarioEncontrado.email = email;
    //             }
    //             else {
    //                 res.status(403).send("Ese usuario y/o email ya están registrados");
    //             }
    //         }
    //         if (usuario) {
    //             let registradoUsuario = await depenGenerales.sequelize.query("SELECT usuario FROM usuarios WHERE usuarios.usuario =:usuario",
    //                 { replacements: { usuario: usuario }, type: depenGenerales.sequelize.QueryTypes.SELECT });
    //             console.log(registradoUsuario.length);
    //             if (registradoUsuario.length != 1) {
    //                 usuarioEncontrado.usuario = usuario;
    //             }
    //             else {
    //                 res.status(403).send("Ese usuario y/o email ya están registrados");
    //             }
    //             next();
    //         }
    //     }
    //     catch (error) {
    //         console.log("error en el checkeo de email o usuarioExistente " + error)
    //     }
    // },