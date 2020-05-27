const express = require('express');
const router = express.Router();
const depenGenerales = require("../../depenGenerales");
const middlewares = require("../../middlewares/mainMiddleware");

router.route('/')

    .get(middlewares.platosFavoritos, async (req, res) => {
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///Ver todos los platos. Si está logeado, trae los platos favoritos.
        ///////////////////////////////////////////////////////////////////////////////////////////
        let todosLosPlatos = await depenGenerales.sequelize.query("SELECT * FROM platos WHERE habilitado=1",
            { type: depenGenerales.sequelize.QueryTypes.SELECT }
        );
        if (res.locals.platosFavoritos != undefined) {
            res.status(200).send({ todos: todosLosPlatos, favoritos: res.locals.platosFavoritos });
        }
        res.status(200).send(todosLosPlatos);
    })



    .post(middlewares.jwtAut, async function (req, res) {
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///Crea un nuevo plato
        ///////////////////////////////////////////////////////////////////////////////////////////
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1) {
            const { nombre, precio, descripcion, img, nuevo_plato, habilitado } = req.body;
            if ((nombre != undefined && precio != undefined && descripcion != undefined && img != undefined && nuevo_plato != undefined && habilitado != undefined)) {
                let nuevoPlato = await depenGenerales.sequelize.query('INSERT INTO platos (nombre, precio, descripcion, img, nuevo_plato, habilitado) VALUES (?,?,?,?,?,?);', {
                    replacements: [nombre, precio, descripcion, img, nuevo_plato, habilitado], type: depenGenerales.sequelize.QueryTypes.INSERT
                });
                res.status(201).send(nuevoPlato);
            } else {
                res.status(422).send("Faltan parametros para la creación del plato");
            }
        }
        else {
            res.status(403).send("No tiene permisos para acceder");
        }
    });


////PLATOS/:id
router.route('/:id')
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///El GET trae cualquier plato. Inclusive los inactivos, se pueden ver, pero no se pueden pedir por otro middleware
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .get(async (req, res) => {
        let reqId = req.params.id;
        let platoEncontrado = await depenGenerales.sequelize.query("SELECT * FROM platos WHERE id=:id",
            { replacements: { id: reqId }, type: depenGenerales.sequelize.QueryTypes.SELECT });
        if (platoEncontrado.length != 0) {
            res.status(200).send(platoEncontrado[0]);
        }
        else {
            res.status(404).send("No se encontro ese plato");
        }
    })

    //Con el put la idea es traer la entrada de la base de datos que voy a cambiar como un objeto
    //En ese objeto actualizar a partir de que datos vengan en el req.body. Y siempre hacer el update a partir del objeto.
    //Siempre se van a actualizar todos los datos y todos van a coincidir con la información que hay en base de datos, excepto
    //esos datos que se hayan pasado en el req.body que si van a haberse actualizado.

    .put(middlewares.jwtAut, middlewares.autorizUsuario, async (req, res) => {
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1) {
            let reqId = req.params.id;
            let platoEncontrado = await depenGenerales.sequelize.query("SELECT * FROM platos WHERE id=:id", ///Acá aprovecho que estoy checkeando si existe el plato que estan pidiendo para obtener la información actualizada del plato (para despues reemplazar).
                { replacements: { id: reqId }, type: depenGenerales.sequelize.QueryTypes.SELECT });
            if (platoEncontrado.length != 0) {
                platoEncontrado = platoEncontrado[0]; //la variable pasa del array al objeto
                const { nombre, precio, descripcion, img, nuevo_plato, habilitado } = req.body; /// cambio de algunos datos
                if ((!nombre || nombre == platoEncontrado.nombre) && (!precio || precio == platoEncontrado.precio) && (!descripcion || descripcion == platoEncontrado.descripcion) && (!img || img == platoEncontrado.img) && (!nuevo_plato || nuevo_plato == platoEncontrado.nuevo_plato) && (!habilitado || habilitado == platoEncontrado.habilitado)) {
                    res.status(200).send("No se hizo ningun cambio"); /// NO SE HIZO NINGUN CAMBIO
                }
                else {
                    if (nombre) {
                        platoEncontrado.nombre = nombre;
                    }
                    if (precio) {
                        platoEncontrado.precio = precio;
                    }
                    if (descripcion) {
                        platoEncontrado.descripcion = descripcion;
                    }
                    if (img) {
                        platoEncontrado.img = img;
                    }
                    if (nuevo_plato) {
                        platoEncontrado.nuevo_plato = nuevo_plato;
                    }
                    if (habilitado) {
                        platoEncontrado.habilitado = habilitado;
                    }
                    let putPlato = await depenGenerales.sequelize.query('UPDATE platos SET nombre=:nombre,precio=:precio,descripcion=:descripcion,img=:img,nuevo_plato=:nuevo_plato,habilitado=:habilitado  WHERE id=:id',
                        { replacements: { nombre: platoEncontrado.nombre, precio: platoEncontrado.precio, descripcion: platoEncontrado.descripcion, img: platoEncontrado.img, nuevo_plato: platoEncontrado.nuevo_plato, habilitado: platoEncontrado.habilitado, id: platoEncontrado.id } })
                    res.status(200).send(putPlato);
                }
            } else {
                res.status(404).send("No se encontró el plato");
            }
        } else {
            res.status(403).send("No tiene permisos para acceder");
        }
    })

    .delete(middlewares.jwtAut, middlewares.autorizUsuario, async (req, res) => {
        let usuarioLogeado = res.locals.usuarioLogeado[0];
        if (usuarioLogeado.admin == 1) {
            let reqId = req.params.id;
            let platoEliminado = await depenGenerales.sequelize.query("DELETE FROM platos WHERE id=:id",
                { replacements: { id: reqId } })
            if (platoEliminado[1] == 0) {
                res.status(404).send("No se encontró el plato");
            } else {
                platoEliminado = platoEliminado[0];
                res.status(200).send("Plato Eliminado");

            }
        } else {
            res.status(403).send("Solo acceso admin");
        }
    })


module.exports = router;


