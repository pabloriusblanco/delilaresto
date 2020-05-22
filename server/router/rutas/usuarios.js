const depenGenerales = require("../../depenGenerales");
const express = require('express');
const router = express.Router();
const middlewares = require("../../middlewares/mainMiddleware");


////// USUARIOS 
router.route('/') ///Traer usuarios o crear usuarios

  .get(middlewares.jwtAut, async (req, res) => { ////Solo admin. Ver todos los usuarios ordenados por nombre
    let usuarioLogeado = res.locals.usuarioLogeado[0];
    if (usuarioLogeado.admin == 1) {
      let allUsers = await depenGenerales.sequelize.query("SELECT * FROM `usuarios` ORDER BY nombreyapellido asc",
      { type: depenGenerales.sequelize.QueryTypes.SELECT }
    );
    res.status(200).send(allUsers);
    }
    else {
      res.status(403).send("Solo acceso admin");
    }

  })



  .post(middlewares.emailUsuarioExistente, async function (req, res) {
    const { usuario, password, nombreyapellido, email, telefono, direccion } = req.body;
    if (usuario != undefined && password != undefined && nombreyapellido != undefined && email != undefined && telefono != undefined && direccion != undefined) {
      let nuevoUsuario = await depenGenerales.sequelize.query('INSERT INTO usuarios (usuario, password, nombreyapellido, email, telefono, direccion) VALUES (?,?,?,?,?,?);', {
        replacements: [usuario, password, nombreyapellido, email, telefono, direccion], type: depenGenerales.sequelize.QueryTypes.INSERT
      });
      console.log(nuevoUsuario);
      res.status(202).send();
    } else {
      res.status(422).send("Faltan parametros para el registro");
    }
  });



router.route('/:id') ///////// GET, PUT, DELETE 
  .get(middlewares.jwtAut, async (req, res) => { ////Admin trae cualquier usuario, el resto nada mas obtiene sus propios datos
    let idPedido = req.params.id;
    console.log(idPedido);
    let usuarioLogeado = res.locals.usuarioLogeado[0];
    if (usuarioLogeado.admin == 1 || usuarioLogeado.id == idPedido) {
      let usuarioEncontrado = await depenGenerales.sequelize.query("SELECT * FROM usuarios where id=:id",
      { replacements: { id: idPedido }, type: depenGenerales.sequelize.QueryTypes.SELECT });
      if (usuarioEncontrado.length != 0) {
        res.status(200).send(usuarioEncontrado);
      } else {
        res.status(404).send("No se encontro ese usuario");
      }
    } else {
        res.status(404).send("No tiene acceso a ese usuario");
    }
  })

  .put(async (req, res) => {
    const { parametro, password } = req.body; /// Como se puede logear por usuario o email recibe un parametro cualquiera
    if (parametro && password) {
      let usuarioEncontrado = await depenGenerales.sequelize.query("SELECT * FROM usuarios where email=:parametro or usuario=:parametro", /// Checkea ambos
        { replacements: { parametro: parametro }, type: depenGenerales.sequelize.QueryTypes.SELECT });
      if (usuarioEncontrado.length && usuarioEncontrado[0].password == password) {
        let tokenEmailConfirm = depenGenerales.jwt.sign(usuarioEncontrado[0].id, depenGenerales.firmaSegura); ///devuelve el ID signed por JWT
        res.status(200).send(tokenEmailConfirm);
      } else {
        res.status(400).send("Usuario o Password Incorrecto");
      }
    } else {
      res.status(422).send("Faltan parametros para el ingreso");
    }
  });




/////// LOGIN ///////
// La idea es que como se puede logear con usuario o email reciba cualquiera de los dos, pero pase el JWT nada mas del ID del usuario/////

router.route('/login')
  .post(async (req, res) => {
    const { parametro, password } = req.body; /// Como se puede logear por usuario o email recibe un parametro cualquiera
    if (parametro && password) {
      let usuarioEncontrado = await depenGenerales.sequelize.query("SELECT * FROM usuarios where email=:parametro or usuario=:parametro", /// Checkea ambos
        { replacements: { parametro: parametro }, type: depenGenerales.sequelize.QueryTypes.SELECT });
      if (usuarioEncontrado.length && usuarioEncontrado[0].password == password) {
        let tokenEmailConfirm = depenGenerales.jwt.sign(usuarioEncontrado[0].id, depenGenerales.firmaSegura); ///devuelve el ID signed por JWT
        res.status(200).send(tokenEmailConfirm);
      } else {
        res.status(400).send("Usuario o Password Incorrecto");
      }
    } else {
      res.status(422).send("Faltan parametros para el ingreso");
    }
  });


module.exports = router;
