const express = require('express');
const router = express.Router();
const depenGenerales = require("../../depenGenerales");
const middlewares = require("../../middlewares/mainMiddleware");

router.route('/')

    .get(middlewares.jwtAut, async (req, res) => {
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 0) { /// Si el usuario no es admin obtiene un historias de sus pedidos
            let todasLasOrdenesUsuario = await depenGenerales.sequelize.query("SELECT fecha,pago,precio_total,id,estado FROM orden WHERE usuarios_id=:id ORDER BY fecha asc",
                { replacements: { id: usuarioLogeado.id }, type: depenGenerales.sequelize.QueryTypes.SELECT })
            if (todasLasOrdenesUsuario.length == 0) {
                res.status(404).send("Usted no tiene ordenes");
            } else {
                res.status(200).send(todasLasOrdenesUsuario);
            }
        }
        if (usuarioLogeado.admin == 1) { /// Si el usuario ES admin es la ruta del homepage del admin
            let todasLasOrdenesAdmin = await depenGenerales.sequelize.query("SELECT o.estado, o.fecha, o.id id_ord, op.cantidad, GROUP_CONCAT(CONCAT(op.cantidad,'x',p.nombre)) as test, o.pago, o.precio_total, u.nombreyapellido, u.direccion, u.id user_id,op.id op_id FROM orden o INNER JOIN usuarios u ON o.usuarios_id = u.id INNER JOIN ordenes_platos op ON op.orden_id = o.id INNER JOIN platos p ON op.platos_id = p.id WHERE o.habilitado=1 GROUP BY o.id ORDER BY estado ASC",
                { type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (todasLasOrdenesAdmin.length == 0) {
                res.status(404).send("No hay ordenes.");
            } else {
                res.status(200).send(todasLasOrdenesAdmin);
            }
        }
    })

    .post(middlewares.jwtAut,middlewares.ordenActiva, async (req, res) => {
        ///Si no hay orden activa crea una orden.
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        let todasLasOrdenesUsuario = await depenGenerales.sequelize.query("SELECT fecha,pago,precio_total,estado FROM orden WHERE usuarios_id=:id ORDER BY fecha asc",
            { replacements: { id: usuarioLogeado.id }, type: depenGenerales.sequelize.QueryTypes.SELECT })
        if (todasLasOrdenesUsuario.length == 0) {
            res.status(404).send("Usted no tiene ordenes");
        } else {
            res.status(200).send(todasLasOrdenesUsuario);
        }
    })

    //     if (usuarioLogeado.admin == 1) { /// Si el usuario ES admin es la ruta del homepage del admin
    //         let todasLasOrdenesAdmin = await depenGenerales.sequelize.query("SELECT o.estado, o.fecha, o.id id_ord, op.cantidad, GROUP_CONCAT(CONCAT(op.cantidad,'x',p.nombre)) as test, o.pago, o.precio_total, u.nombreyapellido, u.direccion, u.id user_id,op.id op_id FROM orden o INNER JOIN usuarios u ON o.usuarios_id = u.id INNER JOIN ordenes_platos op ON op.orden_id = o.id INNER JOIN platos p ON op.platos_id = p.id GROUP BY o.id ORDER BY estado ASC",
    //             { type: depenGenerales.sequelize.QueryTypes.SELECT });
    //         if (todasLasOrdenesAdmin.length == 0) {
    //             res.status(404).send("No hay ordenes.");
    //         } else {
    //             res.status(200).send(todasLasOrdenesAdmin);
    //         }
    //     }
    // })



module.exports = router;


