const depenGenerales = require("../../depenGenerales");
const express = require('express');
const router = express.Router();
const middlewares = require("../../middlewares/mainMiddleware");


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



  .post(middlewares.emailUsuarioExistentePost, async function (req, res) {
    const { usuario, password, nombreyapellido, email, telefono, direccion } = req.body;
    if (usuario != undefined && password != undefined && nombreyapellido != undefined && email != undefined && telefono != undefined && direccion != undefined) {
      let nuevoUsuario = await depenGenerales.sequelize.query('INSERT INTO usuarios (usuario, password, nombreyapellido, email, telefono, direccion) VALUES (?,?,?,?,?,?);', {
        replacements: [usuario, password, nombreyapellido, email, telefono, direccion], type: depenGenerales.sequelize.QueryTypes.INSERT
      });
      res.status(201).send("Usuario creado");
    } else {
      res.status(422).send("Faltan parametros para el registro");
    }
  });



router.route('/:id') ///////// GET, PUT, DELETE ////Admin trae cualquier usuario, el resto nada mas obtiene autorizacion a sus propios datos
  .get(middlewares.jwtAut, middlewares.autorizUsuario, async (req, res) => {
    let usuarioEncontrado = res.locals.usuarioEncontrado;
    if (usuarioEncontrado.length != 0) {
      res.status(200).send(usuarioEncontrado[0]);
    } else {
      res.status(404).send("No se encontro ese usuario");
    }

  })

//Con el put la idea es traer la entrada de la base de datos que voy a cambiar como un objeto
//En ese objeto actualizar a partir de que datos vengan en el req.body. Y siempre hacer el update a partir del objeto.
//Siempre se van a actualizar todos los datos y todos van a coincidir con la información que hay en base de datos, excepto
//esos datos que se hayan pasado en el req.body que si van a haberse actualizado.

  .put(middlewares.jwtAut, middlewares.autorizUsuario, async (req, res) => {
    if (res.locals.usuarioEncontrado != 0) {
      let usuarioEncontrado = res.locals.usuarioEncontrado[0];
      const { password, nombreyapellido, telefono, direccion } = req.body; /// cambio de algunos datos
      if 
      ((!password || password == usuarioEncontrado.password) && 
      (!nombreyapellido || nombreyapellido == usuarioEncontrado.nombreyapellido) && 
      (!telefono || telefono == usuarioEncontrado.telefono) && 
      (!direccion || direccion == usuarioEncontrado.direccion)) {
        res.status(200).send("No se hizo ningun cambio"); /// NO SE HIZO NINGUN CAMBIO
      }
      else {
        if (password) {
          usuarioEncontrado.password = password;
        }
        if (nombreyapellido) {
          usuarioEncontrado.nombreyapellido = nombreyapellido;
        }
        if (telefono) {
          usuarioEncontrado.telefono = telefono;
        }
        if (direccion) {
          usuarioEncontrado.direccion = direccion;
        }
        let putUsuario = await depenGenerales.sequelize.query('UPDATE usuarios SET password=:password,nombreyapellido=:nombreyapellido,telefono=:telefono,direccion=:direccion WHERE id=:id',
          { replacements: { 
            password: usuarioEncontrado.password, 
            nombreyapellido: usuarioEncontrado.nombreyapellido, 
            telefono: usuarioEncontrado.telefono, 
            direccion: usuarioEncontrado.direccion, 
            id: usuarioEncontrado.id 
          }})
        res.status(201).send(putUsuario);
      }
    } else {
      res.status(404).send("No se encontro ese usuario");
    }
  })

  .delete(middlewares.jwtAut, middlewares.autorizUsuario, async (req, res) => {
    let usuarioEncontrado = res.locals.usuarioEncontrado[0];
    console.log(usuarioEncontrado);
    if (usuarioEncontrado != undefined && usuarioEncontrado[0].admin != 1) {
      let deleteUsuario = await depenGenerales.sequelize.query("DELETE FROM `usuarios` WHERE id=:id",
      { replacements: { id: usuarioEncontrado.id } })
      res.status(200).send("Usuario Eliminado \n" + deleteUsuario[0].id);
    } else {
      res.status(404).send("No se encontro ese usuario");
    }
  })



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
