const sequelize = require("../../dbsequelize");
const express = require('express');
const router = express.Router();
const middlewares = require("../../middlewares/test-eliminar")


router.route('/')
  .get(async (req, res) => {
    let allUsers = await sequelize.query("SELECT * FROM usuarios",
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).send(allUsers);
  })
  .post(middlewares.emailExistente, function (req, res) {
    res.status(200).send(res.locals.usuario);
  })
  .put(function (req, res) {
    res.send('Update the book PUT');
  });

  // router.get('/', auth, stuffCtrl.getAllStuff);
  // router.post('/', auth, stuffCtrl.createThing);
  // router.get('/:id', auth, stuffCtrl.getOneThing);
  // router.put('/:id', auth, stuffCtrl.modifyThing);
  // router.delete('/:id', auth, stuffCtrl.deleteThing);


module.exports = router;
