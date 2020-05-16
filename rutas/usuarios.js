const sequelize = require("../servicios/dbsequelize");

module.exports = function (server) {

    server.get('/usuarios', async (req, res) => {
        let allUsers = await sequelize.query("SELECT * FROM usuarios",
            { type: sequelize.QueryTypes.SELECT }
        );
        res.status(200).send(allUsers);
    })
};
