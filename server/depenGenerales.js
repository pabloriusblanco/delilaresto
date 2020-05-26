/////Aca estan la mayoria de dependencias que se usan a lo largo de la aplicacion////

/////SEQUELIZE////
const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysql://root@localhost:3306/delilahresto",{dialectOptions: {multipleStatements: true}});
/////JWT////
const jwt = require("jsonwebtoken");
const firmaSegura = "lV1QzZXH7a";


const depenGenerales = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    jwt: jwt,
    firmaSegura: firmaSegura
}

module.exports = depenGenerales;