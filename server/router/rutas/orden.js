const express = require('express');
const router = express.Router();
const depenGenerales = require("../../depenGenerales");
const middlewares = require("../../middlewares/mainMiddleware");

router.route('/')
    .get(middlewares.jwtAut, async (req, res) => {
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 0) {
            //////////////////////////////////////////////////////////////////////////////////////////////
            /// Si el usuario no es admin obtiene un historias de sus pedidos
            //////////////////////////////////////////////////////////////////////////////////////////////
            let todasLasOrdenesUsuario = await depenGenerales.sequelize.query(`
            SELECT 
            o.fecha, 
            o.id id_ord, 
            GROUP_CONCAT(CONCAT(op.cantidad,'x',p.nombre)) as platos, 
            o.pago, 
            o.precio_total, 
            op.id op_id 
            FROM orden o 
            INNER JOIN ordenes_platos op ON op.orden_id = o.id 
            INNER JOIN platos p ON op.platos_id = p.id 
            WHERE o.habilitado=1 and o.usuarios_id=:id 
            GROUP BY o.id 
            ORDER BY fecha asc`,
                { replacements: { id: usuarioLogeado.id }, type: depenGenerales.sequelize.QueryTypes.SELECT })
            if (todasLasOrdenesUsuario.length == 0) {
                res.status(404).send("Usted no tiene ordenes");
            } else {
                res.status(200).send(todasLasOrdenesUsuario);
            }
        }
        if (usuarioLogeado.admin == 1) {
            //////////////////////////////////////////////////////////////////////////////////////////////
            /// Si el usuario ES admin es la ruta del homepage del admin
            //////////////////////////////////////////////////////////////////////////////////////////////
            let todasLasOrdenesAdmin = await depenGenerales.sequelize.query(`
            SELECT 
            o.estado, 
            o.fecha, 
            o.id id_ord, 
            GROUP_CONCAT(CONCAT(op.cantidad,'x',p.nombre)) as platos, 
            o.pago, o.precio_total, 
            u.nombreyapellido, 
            u.direccion, 
            u.id user_id,
            op.id op_id 
            FROM orden o 
            INNER JOIN usuarios u ON o.usuarios_id = u.id 
            INNER JOIN ordenes_platos op ON op.orden_id = o.id 
            INNER JOIN platos p ON op.platos_id = p.id 
            WHERE o.habilitado=1 GROUP BY o.id 
            ORDER BY estado ASC`,
                { type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (todasLasOrdenesAdmin.length == 0) {
                res.status(404).send("No hay ordenes.");
            } else {
                res.status(200).send(todasLasOrdenesAdmin);
            }
        }
    });

router.route('/id/:orden_id')
    .get(middlewares.jwtAut, middlewares.ordenProceso, async (req, res) => {
        ////////////////////////////////////////////////////////////////////////////////
        ///Obtiene la orden por ID. Si es usuario nada más puede acceder a sus ordenes.
        ////////////////////////////////////////////////////////////////////////////////
        let ordenIdUsuario = res.locals.ordenIdUsuario;
        res.status(200).send(ordenIdUsuario);
    })

    .put(middlewares.jwtAut, middlewares.ordenProceso, async (req, res) => {
        ////////////////////////////////////////////////////////////////////////////////
        ///Permite al admin cambiar datos de la orden. Normalmente los estados y nada mas.
        /// ESTADOS:
        /// 1 nuevo - 2 confirmado - 3 preparando - 4 enviando - 5 entregado - 6 cancelado
        ////////////////////////////////////////////////////////////////////////////////
        let ordenIdUsuario = res.locals.ordenIdUsuario;
        const { fecha, pago, precio_total, comentarios, estado } = req.body;
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1) {
            if (fecha) {
                ordenIdUsuario.fecha = fecha;
            }
            if (pago) {
                ordenIdUsuario.pago = pago;
            }
            if (precio_total) {
                ordenIdUsuario.precio_total = precio_total;
            }
            if (comentarios) {
                ordenIdUsuario.comentarios = comentarios;
            }
            if (estado) {
                ordenIdUsuario.estado = estado;
            }
            let putOrden = await depenGenerales.sequelize.query(`
            UPDATE orden SET
            fecha=:fecha,
            pago=:pago,
            precio_total=:precio_total,
            comentarios=:comentarios,
            estado=:estado
            WHERE id=:orden_id`,
                {
                    replacements:
                    {
                        fecha: ordenIdUsuario.fecha,
                        pago: ordenIdUsuario.pago,
                        precio_total: ordenIdUsuario.precio_total,
                        comentarios: ordenIdUsuario.comentarios,
                        estado: ordenIdUsuario.estado,
                        orden_id: ordenIdUsuario.id_ord
                    }
                });
            res.status(200).send({ confirmado: "Orden del usuario actualizada", datosActualizados: putOrden });
        }
        if (usuarioLogeado.admin == 0) {
            ////////////////////////////////////////////////////////////////////////////////
            ///Al usuario le permite CANCELAR su pedido si no lleguó a estado 3.
            /// ESTADOS:
            /// 1 nuevo - 2 confirmado - 3 preparando - 4 enviando - 5 entregado - 6 cancelado
            ////////////////////////////////////////////////////////////////////////////////
            if (estado == 6 && ordenIdUsuario.estado <= 2) {
                ordenIdUsuario.estado = estado;
                let putOrden = await depenGenerales.sequelize.query(`
                UPDATE orden SET
                estado=6
                WHERE id=:orden_id`,
                    {
                        replacements:
                        {
                            orden_id: ordenIdUsuario.id_ord
                        }
                    });
                res.status(200).send("Orden cancelada");
            }
            else {
                res.status(403).send({ confirmado: "No se puede cancelar el pedido", telefono: "5411XXXXXXXX" });
            }

        }
    })

    .delete(middlewares.jwtAut, middlewares.ordenProceso, async (req, res) => {
        ////////////////////////////////////////////////////////////////////////////////////
        ///Permite al admin eliminar una orden activa junto con todos los elementos pedidos.
        ////////////////////////////////////////////////////////////////////////////////////
        let ordenIdUsuario = res.locals.ordenIdUsuario;
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1) {
            let deleteOrden = await depenGenerales.sequelize.query(`
            DELETE FROM ordenes_platos 
            WHERE ordenes_platos.orden_id=:orden_id; 
            DELETE FROM orden WHERE orden.id=:orden_id`,
                {
                    replacements:
                    {
                        orden_id: ordenIdUsuario.id_ord
                    }
                });
            res.status(204).send("Orden eliminada");
        }
        else {
            res.status(403).send("No tiene permisos para acceder");
        }
    });

router.route('/confirmar')

    .put(middlewares.jwtAut, middlewares.ordenActiva, async (req, res) => {
        //////////////////////////////////////////////////////////////////////////////////////////////
        ///Confirma la orden y pasa a estar habilitada para el Admin
        //////////////////////////////////////////////////////////////////////////////////////////////

        let carritoActivo = res.locals.carritoActivo;
        let ordenActiva = {};
        ordenActiva.id = res.locals.ordenId;
        let precioFinal = function () { ///CONSIGUE EL PRECIO TOTAL
            let sumaPrecio = 0;
            for (let index = 0; index < carritoActivo.length; index++) {
                sumaPrecio += carritoActivo[index].precio_cantidad;
            }
            return sumaPrecio;
        }
        const { pago, comentarios } = req.body;
        if (pago == "Efectivo" || pago == "Tarjeta") { //// COMIENZA A ARMAR EL OBJETO ACTUALIZADO
            ordenActiva.pago = pago;
            ordenActiva.comentarios = "";
            if (comentarios) {
                ordenActiva.comentarios = comentarios;
            };
            ordenActiva.precio_total = precioFinal();
            ordenActiva.habilitado = 1;
            let putOrden = await depenGenerales.sequelize.query(`
            UPDATE orden SET 
            fecha=CURRENT_TIMESTAMP,
            pago=:pago,
            precio_total=:precio_total,
            comentarios=:comentarios,
            habilitado=:habilitado 
            WHERE id=:id`,
                {
                    replacements:
                    {
                        pago: ordenActiva.pago,
                        precio_total: ordenActiva.precio_total,
                        comentarios: ordenActiva.comentarios,
                        habilitado: ordenActiva.habilitado,
                        id: ordenActiva.id
                    }
                });
            if (putOrden.length != 0) {
                res.status(200).send("Su pedido se ha realizado " + ordenActiva);
            } else {
                console.log("No se proceso la orden: " + ordenActiva)
                res.status(500).send("Error inesperado. Por favor llame por teléfono al XXXXXXXXXX para hacer su pedido.");
            }
        }
        else {
            res.status(412).send("Metodo de pago inválido");
        }
    });

/////////////////////////////////////////////////////////////////////////
//////////////////////////////Pedidos////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

router.route('/carrito')
    .get(middlewares.jwtAut, middlewares.ordenActiva, async (req, res) => {
        //////////////////////////////////////////////////////////////////////////////////////////////
        ///Obtiene la orden activa
        //////////////////////////////////////////////////////////////////////////////////////////////
        let carritoActivo = res.locals.carritoActivo;
        res.status(200).send({
            precio: res.locals.precioFinal,
            orden: carritoActivo
        });
    });

router.route('/carrito/:plato_id')
    .post(middlewares.jwtAut, middlewares.AutPlatos, middlewares.ordenActiva, async (req, res) => {
        //////////////////////////////////////////////////////////////////////////////////////////////
        /// AGrega un nuevo plato a la orden activa
        //////////////////////////////////////////////////////////////////////////////////////////////
        let orden_id = res.locals.ordenId;
        let platoEncontrado = res.locals.platoEncontrado;
        let plato_id = platoEncontrado.id;
        const { cantidad } = req.body;
        let carritoConPlato = await depenGenerales.sequelize.query(`
        INSERT INTO ordenes_platos
        (orden_id, platos_id, cantidad,precio) 
        VALUES (?,?,?,?)
        `,
            {
                replacements: [
                    orden_id, plato_id, cantidad, (platoEncontrado.precio * cantidad)
                ],
                type: depenGenerales.sequelize.QueryTypes.INSERT
            })

        res.status(200).send(carritoConPlato);
    })

    .put(middlewares.jwtAut, middlewares.AutPlatos, middlewares.ordenActiva, async (req, res) => {
        //////////////////////////////////////////////////////////////////////////////////////////////
        /// Cambia la cantidad de platos del pedido. Si es cero o menos elimina la entrada
        //////////////////////////////////////////////////////////////////////////////////////////////
        let orden_id = res.locals.ordenId;
        let platoEncontrado = res.locals.platoEncontrado;
        let plato_id = req.params.plato_id;
        const { cantidad } = req.body;
        let carritoActualizado = await depenGenerales.sequelize.query(`
        UPDATE ordenes_platos
        SET 
        cantidad=:cantidad,
        precio=:precio
        WHERE 
        orden_id=:orden_id AND
        platos_id=:plato_id
        `,
            {
                replacements: {
                    cantidad: cantidad,
                    precio: (platoEncontrado.precio * cantidad),
                    orden_id: orden_id,
                    plato_id: plato_id
                },
                type: depenGenerales.sequelize.QueryTypes.INSERT
            })
        if (carritoActualizado[1] == 0) {
            ///Evalua que si se cambio algun dato
            res.status(404).send("No se hizo ningun cambio");
        }
        else {
            if (cantidad <= 0) {
                let deletePlato = await depenGenerales.sequelize.query(`
                    DELETE FROM 
                    ordenes_platos
                    WHERE 
                    orden_id=:orden_id AND
                    platos_id=:plato_id`,
                    {
                        replacements: {
                            orden_id: orden_id,
                            plato_id: plato_id
                        },
                    }
                )
                res.status(204).send("Plato Eliminado de su pedido");
            } else {
                res.status(200).send("Plato actualizado");
            }
        }


    })




module.exports = router;
