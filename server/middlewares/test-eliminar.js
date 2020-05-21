const jwt = require("jsonwebtoken");
const sequelize = require("../dbsequelize");


const test = {
    emailExistente: async function emailExistente(req,res,next) {
        console.log("test emailExistente");
        const {email} = req.body;
        if (email) {
            res.locals.usuario = await sequelize.query("SELECT id FROM usuarios where email=:email",
            { replacements: {email: email}, type: sequelize.QueryTypes.SELECT });
            console.log(res.locals.usuario);
            next();
        }
    }
}

module.exports = test;