const sequelize = require("../../dbsequelize");
const express = require('express');
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    let allUsers = await sequelize.query("SELECT * FROM usuarios",
        { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).send(allUsers);
})
  .post(function(req, res) {
    res.status(200).send("hello world POST");
  })
  .put(function(req, res) {
    res.send('Update the book PUT');
  });


module.exports = router;
