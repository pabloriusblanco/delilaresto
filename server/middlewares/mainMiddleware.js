const depenGenerales = require("../depenGenerales");


const mainMiddleware = {
    jwtAut: async function (req, res, next) {
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///Login con JWT. Evalua si existe el JWT, lo desencripta y pasa por res.locals al usuario
        ///////////////////////////////////////////////////////////////////////////////////////////
        if (req.headers.authorization) {
            let jwtVerified = depenGenerales.jwt.verify(req.headers.authorization.split(" ")[1], depenGenerales.firmaSegura)
            res.locals.usuarioLogeado = await depenGenerales.sequelize.query("SELECT * FROM usuarios WHERE usuarios.id =:id",
                { replacements: { id: jwtVerified }, type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (res.locals.usuarioLogeado.length != 0) {
                next()
            } else {
                res.status(403).send("No tiene permisos para acceder");
            }
        } else {
            res.status(401).send("Necesita estar logeado para realizar esa accion");
        }

    },
    emailUsuarioExistentePost: async function (req, res, next) {
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        /////Revisa si existe el mail o el usuario, porque el cliente se puede logear con cualquiera de los dos
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
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
            res.status(409).send("Debe agregar usuario y email para registrarse");
        }
    },



    //////////////////////////////////////////////////////////////////////////////////
    ///Este middleware evalua que el usuario tenga acceso al pedido que está haciendo
    //////////////////////////////////////////////////////////////////////////////////
    autorizUsuario: async function (req, res, next) {
        let idPedido = req.params.id;
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1 || usuarioLogeado.id == idPedido) {
            res.locals.usuarioEncontrado = await depenGenerales.sequelize.query("SELECT * FROM usuarios where id=:id",
                { replacements: { id: idPedido }, type: depenGenerales.sequelize.QueryTypes.SELECT });
            next();
        }
        else {
            res.status(401).send("No tiene acceso");
        }
    },


    AutPlatos: async function (req, res, next) {
        ///////////////////////////////////////////////////////////////////////////
        //Evalua que el plato que se esta agregando no esté deshabilitado y exista
        ///////////////////////////////////////////////////////////////////////////
        let plato_id = req.params.plato_id
        let platoEncontrado = await depenGenerales.sequelize.query("SELECT * FROM platos WHERE id=:id",
            { replacements: { id: plato_id }, type: depenGenerales.sequelize.QueryTypes.SELECT });
        if (platoEncontrado.length != 0 && platoEncontrado[0].habilitado == 1) {
            res.locals.platoEncontrado = platoEncontrado[0];
            next();
        }
        else {
            res.status(404).send("No existe el plato");
        }
    },

    ordenProceso: async function (req, res, next) {
        ////////////////////////////////////////////////////////////////////////////////
        ///Pasa como parametro la orden elegida en orden/id/:id
        ////////////////////////////////////////////////////////////////////////////////
        let ordenID = req.params.orden_id;
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        let ordenIdUsuario = await depenGenerales.sequelize.query(`
            SELECT
            o.usuarios_id,
            o.estado,
            o.fecha, 
            o.id id_ord,
            o.comentarios,
            GROUP_CONCAT(p.img) as imagenes,
            GROUP_CONCAT(op.cantidad) as cantidades,
            GROUP_CONCAT(p.nombre) as platos, 
            o.precio_total, 
            o.pago,
            op.id op_id 
            FROM orden o 
            INNER JOIN ordenes_platos op ON op.orden_id = o.id 
            INNER JOIN platos p ON op.platos_id = p.id
            WHERE o.id=:orden_id AND
            
            o.habilitado=1`,
            { replacements: { orden_id: ordenID }, type: depenGenerales.sequelize.QueryTypes.SELECT })
        if (ordenIdUsuario[0].estado == null) {
            res.status(404).send("La orden no existe o no tiene acceso");
        } else {
            if (ordenIdUsuario[0].usuarios_id == usuarioLogeado.id || usuarioLogeado.admin == 1) {
                res.locals.ordenIdUsuario = ordenIdUsuario[0];
                next();
            } else {
                res.status(404).send("No tiene acceso");
            }
        }
    },

    ordenActiva: async function (req, res, next) {
        //////////////////////////////////////////////////////////////////////////////////////////////
        ///Evalua si hay una carrito activo. Si no existe lo crea, si no hay platos cargados lo borra. 
        //////////////////////////////////////////////////////////////////////////////////////////////
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        res.locals.carritoActivo = await depenGenerales.sequelize.query(`
        SELECT op.*, p.nombre plato_nombre, p.precio, o.pago 
        FROM ordenes_platos op 
        INNER JOIN orden o ON op.orden_id = o.id 
        INNER JOIN platos p ON op.platos_id = p.id 
        WHERE o.usuarios_id=:id and o.habilitado=0`,
            { replacements: { id: usuarioLogeado.id }, type: depenGenerales.sequelize.QueryTypes.SELECT });

        if (res.locals.carritoActivo.length != 0) {
            res.locals.precioFinal = 0;
            res.locals.ordenId = res.locals.carritoActivo[0].orden_id;
            if (res.locals.carritoActivo[0].platos_id != null) {
                for (let index = 0; index < res.locals.carritoActivo.length; index++) {
                    res.locals.carritoActivo[index].precio_cantidad = res.locals.carritoActivo[index].precio * res.locals.carritoActivo[index].cantidad;
                    res.locals.precioFinal += res.locals.carritoActivo[index].precio * res.locals.carritoActivo[index].cantidad;
                }
                next();
            } else { ///// Si no hay ningún elemento en el carrito, borra la orden y las tablas asociadas a esa orden.
                let eliminarErrorCarrito = await depenGenerales.sequelize.query(`
                DELETE FROM ordenes_platos 
                WHERE ordenes_platos.orden_id=:orden_id; 
                DELETE FROM orden WHERE orden.id=:orden_id`,
                    { replacements: { orden_id: res.locals.ordenId } });
                console.log("Error en el carrito. Eliminado" + eliminarErrorCarrito)
                res.status(204).send("No hay elementos en su carrito");
            }
        }
        else {
            /// CREA LA ORDEN SI NO HAY ORDENES ACTIVAS
            if (req.method == "POST") {
                let nuevaOrden = await depenGenerales.sequelize.query("INSERT INTO orden (usuarios_id) VALUES (?);",
                    {
                        replacements: [usuarioLogeado.id],
                        type: depenGenerales.sequelize.QueryTypes.INSERT
                    });
                res.locals.ordenId = nuevaOrden[0];
                next();
            }
            else {
                res.status(204).send("No hay elementos en su carrito");
            }
        }
    }
}

module.exports = mainMiddleware;