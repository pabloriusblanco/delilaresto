/////Aca estan la mayoria de dependencias que se usan a lo largo de la aplicacion////

const database = "mysql";
const username = "root"; //default
const password = ""; /// sin password por default
const host = "localhost"; //default
const port = 3306; ///default
const databasename = "delilahresto" //default

/////SEQUELIZE////
const Sequelize = require("sequelize");
const sequelize = new Sequelize(database+"://"+username+password+"@"+host+":"+port+"/"+databasename, {
    dialectOptions: { multipleStatements: true }
});

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